import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "safehour.db";
const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";
const DEFAULT_CURRENCY = "VND";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

type MetadataRow = {
  value: string;
};

type UserIdRow = {
  id: string;
};

export async function initializeLocalDatabase() {
  const db = await getDatabase();

  // Migration for protection_entries to v1.1.0 (check if destination column exists)
  try {
    const tableInfo = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(protection_entries);"
    );
    const hasDestination = tableInfo.some((col) => col.name === "destination");
    if (tableInfo.length > 0 && !hasDestination) {
      await db.execAsync("DROP TABLE IF EXISTS protection_entries;");
    }
  } catch (error) {
    console.error("Migration check failed", error);
  }

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      display_name TEXT,
      email TEXT,
      recovery_start_date TEXT NOT NULL,
      longest_streak_days INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak_days >= 0),
      preferred_currency TEXT NOT NULL,
      primary_contact_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (primary_contact_id) REFERENCES accountability_contacts(id)
    );

    CREATE TABLE IF NOT EXISTS accountability_contacts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      relationship TEXT,
      phone TEXT,
      email TEXT,
      preferred_method TEXT NOT NULL CHECK (preferred_method IN ('call', 'sms', 'email')),
      is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS urges (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),
      trigger TEXT NOT NULL,
      emotion TEXT NOT NULL,
      action_taken TEXT NOT NULL,
      contacted_support INTEGER NOT NULL CHECK (contacted_support IN (0, 1)),
      resulted_in_relapse INTEGER NOT NULL CHECK (resulted_in_relapse IN (0, 1)),
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      gambled_today INTEGER NOT NULL CHECK (gambled_today IN (0, 1)),
      moved_money_toward_gambling INTEGER NOT NULL CHECK (moved_money_toward_gambling IN (0, 1)),
      urge_level INTEGER NOT NULL CHECK (urge_level BETWEEN 1 AND 10),
      mood TEXT NOT NULL,
      contacted_support INTEGER NOT NULL CHECK (contacted_support IN (0, 1)),
      next_safe_action TEXT,
      created_at TEXT NOT NULL,
      UNIQUE (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS loss_ledger_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      amount_lost REAL NOT NULL CHECK (amount_lost > 0),
      currency TEXT NOT NULL,
      source_of_money TEXT NOT NULL,
      is_borrowed_money INTEGER NOT NULL CHECK (is_borrowed_money IN (0, 1)),
      context TEXT,
      locked_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TRIGGER IF NOT EXISTS loss_ledger_amount_write_once
    BEFORE UPDATE OF amount_lost ON loss_ledger_entries
    BEGIN
      SELECT RAISE(ABORT, 'amount_lost is write-once');
    END;

    CREATE TABLE IF NOT EXISTS safety_plans (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      main_reason_to_stop TEXT,
      biggest_risk TEXT,
      emergency_message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS safety_commitments (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      safety_plan_id TEXT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'broken')),
      start_date TEXT NOT NULL,
      end_date TEXT,
      verified_by_contact INTEGER CHECK (verified_by_contact IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (safety_plan_id) REFERENCES safety_plans(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS protection_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      amount_protected REAL NOT NULL,
      currency TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('saved', 'debt_repaid', 'withdrawal')),
      destination TEXT NOT NULL,
      reachability TEXT CHECK (reachability IN ('self_held', 'held_by_other')),
      linked_debt_item_id TEXT,
      context TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export async function isOnboardingCompleted() {
  const db = await getDatabase();
  const row = await db.getFirstAsync<MetadataRow>(
    "SELECT value FROM metadata WHERE key = ?",
    ONBOARDING_COMPLETED_KEY,
  );

  return row?.value === "true";
}

export async function completeOnboarding() {
  await ensureDefaultUser();
  await setMetadataValue(ONBOARDING_COMPLETED_KEY, "true");
}

export async function resetOnboardingForDevelopment() {
  if (!__DEV__) {
    return;
  }

  await setMetadataValue(ONBOARDING_COMPLETED_KEY, "false");
}

export async function wipeLocalDataForDevelopment() {
  if (!__DEV__) {
    return;
  }

  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM protection_entries;
    DELETE FROM safety_commitments;
    DELETE FROM safety_plans;
    DELETE FROM loss_ledger_entries;
    DELETE FROM check_ins;
    DELETE FROM urges;
    DELETE FROM accountability_contacts;
    DELETE FROM users;
    DELETE FROM metadata;
    PRAGMA foreign_keys = ON;
  `);
}

export async function debugReadStorage() {
  if (!__DEV__) {
    return;
  }

  const db = await getDatabase();
  const metadata = await db.getAllAsync("SELECT * FROM metadata");
  const users = await db.getAllAsync("SELECT * FROM users");

  console.log("SafeHour metadata", metadata);
  console.log("SafeHour users", users);
}

async function ensureDefaultUser() {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<UserIdRow>(
    "SELECT id FROM users LIMIT 1",
  );

  if (existing) {
    return existing.id;
  }

  const now = new Date().toISOString();
  const recoveryStartDate = now.slice(0, 10);
  const userId = createUuid();

  await db.runAsync(
    `INSERT INTO users (
      id,
      display_name,
      email,
      recovery_start_date,
      longest_streak_days,
      preferred_currency,
      primary_contact_id,
      created_at,
      updated_at
    ) VALUES (?, NULL, NULL, ?, 0, ?, NULL, ?, ?)`,
    userId,
    recoveryStartDate,
    DEFAULT_CURRENCY,
    now,
    now,
  );

  return userId;
}

async function setMetadataValue(key: string, value: string) {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO metadata (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value,
    now,
  );
}

async function getDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME);
  return databasePromise;
}

function createUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export type ProtectionEntry = {
  id: string;
  user_id: string;
  amount_protected: number;
  currency: string;
  kind: "saved" | "debt_repaid" | "withdrawal";
  destination: string;
  reachability: "self_held" | "held_by_other" | null;
  linked_debt_item_id: string | null;
  context: string | null;
  created_at: string;
  updated_at: string;
};

export async function saveProtectionEntry(entry: {
  amount: number;
  currency: string;
  kind: "saved" | "debt_repaid" | "withdrawal";
  destination: string;
  reachability?: "self_held" | "held_by_other" | null;
  context?: string;
}) {
  if (entry.kind === "saved" || entry.kind === "debt_repaid") {
    if (entry.amount <= 0) {
      throw new Error("Amount must be positive for saved or debt_repaid entries");
    }
  } else if (entry.kind === "withdrawal") {
    if (entry.amount >= 0) {
      throw new Error("Amount must be negative for withdrawal entries");
    }
  }

  const db = await getDatabase();
  const userId = await ensureDefaultUser();
  const now = new Date().toISOString();
  const id = createUuid();

  await db.runAsync(
    `INSERT INTO protection_entries (
      id,
      user_id,
      amount_protected,
      currency,
      kind,
      destination,
      reachability,
      linked_debt_item_id,
      context,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?)`,
    id,
    userId,
    entry.amount,
    entry.currency,
    entry.kind,
    entry.destination,
    entry.kind === "debt_repaid" ? null : (entry.reachability ?? null),
    entry.context ?? null,
    now,
    now,
  );
}

export async function getProtectionEntries(): Promise<ProtectionEntry[]> {
  const db = await getDatabase();
  const userId = await ensureDefaultUser();
  return db.getAllAsync<ProtectionEntry>(
    "SELECT * FROM protection_entries WHERE user_id = ? ORDER BY created_at DESC",
    userId,
  );
}

export async function getMoneyProtectedSum(): Promise<number> {
  const db = await getDatabase();
  const userId = await ensureDefaultUser();
  const row = await db.getFirstAsync<{ total: number }>(
    "SELECT COALESCE(SUM(amount_protected), 0) as total FROM protection_entries WHERE user_id = ?",
    userId,
  );
  return row?.total ?? 0;
}
