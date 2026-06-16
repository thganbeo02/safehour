import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import type { IconSvgName } from "@/components/icons";
import ShieldLoveLogo from "@/assets/onboarding/shield-love.svg";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

const { width } = Dimensions.get("window");

type OnboardingScreenProps = {
  onEnter: () => void | Promise<void>;
};

type HelpItem = {
  iconName: IconSvgName;
  title: string;
  body: string;
};

type BoundaryItem = {
  iconName: IconSvgName;
  label: string;
};

type SetupItem = {
  iconName: IconSvgName;
  title: string;
  body: string;
  required?: boolean;
};

const helpItems: HelpItem[] = [
  {
    iconName: "IC_WIND",
    title: "Pause during urges",
    body: "Instant access to grounding exercises when you feel the pull to act.",
  },
  {
    iconName: "IC_NOTEBOOK_PEN",
    title: "Record honestly without chasing",
    body: "Record what happened without turning it into a target.",
  },
  {
    iconName: "IC_CIRCLE_USER_ROUND",
    title: "Contact instead of isolating",
    body: "Quickly reach your trusted person before isolation leads to relapse.",
  },
  {
    iconName: "IC_PIGGY_BANK",
    title: "Protect money from the loop",
    body: "Notice what you set aside or repay without turning it into a goal.",
  },
];

const boundaryItems: BoundaryItem[] = [
  { iconName: "IC_NOTEBOOK_PEN", label: "NO\ntrading journal" },
  { iconName: "IC_CHART_CANDLESTICK", label: "NO\nmarket charts" },
  { iconName: "IC_TARGET", label: "NO\nprofit targets" },
  { iconName: "IC_UNDO_2", label: "NO\nchasing losses" },
];

const setupItems: SetupItem[] = [
  {
    iconName: "IC_PHONE",
    title: "Trusted contact",
    body: "Someone you can contact before acting on an urge.",
    required: true,
  },
  {
    iconName: "IC_SHIELD_CHECK",
    title: "Safety commitments",
    body: "Simple rules that create distance from risky decisions.",
    required: true,
  },
  {
    iconName: "IC_BELL_RING",
    title: "Daily check-in reminder",
    body: "A gentle daily pause to notice patterns early.",
  },
];

export function OnboardingScreen({ onEnter }: OnboardingScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const [hasStarted, setHasStarted] = useState(false);
  const [page, setPage] = useState(1);
  const [completedSetups, setCompletedSetups] = useState<
    Record<string, boolean>
  >({});

  const requiredCompleted = setupItems
    .filter((item) => item.required)
    .every((item) => completedSetups[item.title]);

  function toggleSetupCompleted(title: string) {
    setCompletedSetups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextPage = Math.round(event.nativeEvent.contentOffset.x / width) + 1;
    setPage(nextPage);
  }

  function goToPage(nextPage: number) {
    scrollRef.current?.scrollTo({ x: (nextPage - 1) * width, animated: true });
    setPage(nextPage);
  }

  function startOnboarding() {
    Animated.timing(transitionOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setHasStarted(true);
      setPage(1);

      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  }

  if (!hasStarted) {
    return (
      <Animated.View style={[styles.root, { opacity: transitionOpacity }]}>
        <IntroPage onStart={startOnboarding} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.root, { opacity: transitionOpacity }]}>
      <OnboardingHeader step={page} />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        <HelpPage />
        <BoundariesPage />
        <SetupPage
          completedSetups={completedSetups}
          onToggleSetup={toggleSetupCompleted}
        />
      </ScrollView>
      {page === 3 && !requiredCompleted ? (
        <View style={styles.warningWrap} pointerEvents="none">
          <Text style={styles.warningText}>
            Complete the required steps to continue.
          </Text>
        </View>
      ) : null}
      <FixedStepButton
        label={page === 3 ? "Enter SafeHour" : "Next"}
        disabled={page === 3 && !requiredCompleted}
        onPress={page === 3 ? onEnter : () => goToPage(page + 1)}
      />
    </Animated.View>
  );
}

function OnboardingHeader({ step }: { step: number }) {
  return (
    <View style={styles.header} pointerEvents="none">
      <View style={styles.progressPills}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.progressPill,
              step === item && styles.progressPillActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepText}>STEP {step} OF 3</Text>
    </View>
  );
}

function IntroPage({ onStart }: { onStart: () => void }) {
  const pressProgress = useRef(new Animated.Value(0)).current;
  const buttonScale = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });
  const buttonColor = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.navy, colors.teal],
  });

  function animatePress(toValue: number) {
    Animated.timing(pressProgress, {
      toValue,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  return (
    <View style={[styles.page, styles.introPage]}>
      <Image
        source={require("@/assets/onboarding/intro.png")}
        style={styles.introImage}
        resizeMode="contain"
      />
      <Text style={styles.introTitle}>
        Create distance from the next harmful action.
      </Text>
      <Text style={styles.introBody}>
        SafeHour helps you pause, contact support, and protect what remains.
      </Text>
      <Pressable
        onPress={onStart}
        onPressIn={() => animatePress(1)}
        onPressOut={() => animatePress(0)}
      >
        <Animated.View
          style={[
            styles.introButton,
            {
              backgroundColor: buttonColor,
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <Text style={styles.introButtonText}>Set up my safety plan</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

function HelpPage() {
  return (
    <ContentPage>
      <Text style={styles.heading}>What SafeHour helps with</Text>
      <Text style={styles.subheading}>
        Tools designed to protect your peace and your progress.
      </Text>
      <View style={styles.helpList}>
        {helpItems.map((item) => (
          <View key={item.title} style={styles.helpRow}>
            <View style={styles.iconBox}>
              <IconSvgLocal name={item.iconName} size={40} />
            </View>
            <View style={styles.helpCopy}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemBody}>{item.body}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.helpQuote}>
        "Protection, not performance, is the priority."
      </Text>
    </ContentPage>
  );
}

function BoundariesPage() {
  return (
    <ContentPage>
      <Text style={styles.heading}>What SafeHour is NOT</Text>
      <Text style={styles.subheading}>
        Setting clear boundaries to keep your distance from harmful patterns.
      </Text>
      <View style={styles.boundaryGrid}>
        {boundaryItems.map((item) => (
          <View key={item.label} style={styles.boundaryCard}>
            <View style={styles.iconBoxLarge}>
              <IconSvgLocal name={item.iconName} size={40} />
              <View style={styles.noBadge}>
                <IconSvgLocal name="IC_STOP" size={20} />
              </View>
            </View>
            <Text style={styles.boundaryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.quoteBox}>
        <Text style={styles.quoteBoxText}>
          "This is a safety app, not a finance app. We are here to protect your
          tomorrow, not analyze your yesterday."
        </Text>
      </View>
    </ContentPage>
  );
}

function SetupCard({
  item,
  isCompleted,
  onPress,
}: {
  item: SetupItem;
  isCompleted: boolean;
  onPress: () => void;
}) {
  const pressProgress = useRef(new Animated.Value(0)).current;
  const cardScale = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });
  const cardBg = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.offWhite, colors.paleTeal],
  });

  function animatePress(toValue: number) {
    Animated.timing(pressProgress, {
      toValue,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animatePress(1)}
      onPressOut={() => animatePress(0)}
    >
      <Animated.View
        style={[
          styles.setupCard,
          {
            transform: [{ scale: cardScale }],
            backgroundColor: cardBg,
          },
        ]}
      >
        <View style={styles.iconBox}>
          <IconSvgLocal name={item.iconName} size={40} />
        </View>
        <View style={styles.setupCopy}>
          <View style={styles.setupTitleRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.required && !isCompleted ? (
              <Text style={styles.required}>REQUIRED</Text>
            ) : null}
          </View>
          <Text style={styles.itemBody}>{item.body}</Text>
        </View>
        {isCompleted ? (
          <IconSvgLocal name="IC_COMPLETE" size={28} />
        ) : (
          <IconSvgLocal name="IC_CHEVRON" size={28} color="#000000" />
        )}
      </Animated.View>
    </Pressable>
  );
}

function SetupPage({
  completedSetups,
  onToggleSetup,
}: {
  completedSetups: Record<string, boolean>;
  onToggleSetup: (title: string) => void;
}) {
  return (
    <ContentPage>
      <Text style={styles.heading}>Complete your setup</Text>
      <Text style={styles.subheading}>
        Setting up your support plan only takes a couple more minutes.
      </Text>
      <View style={styles.setupList}>
        {setupItems.map((item) => (
          <SetupCard
            key={item.title}
            item={item}
            isCompleted={!!completedSetups[item.title]}
            onPress={() => onToggleSetup(item.title)}
          />
        ))}
      </View>
      <View style={styles.statusRow}>
        <ShieldLoveLogo width={240} height={180} />
      </View>
    </ContentPage>
  );
}

function ContentPage({ children }: { children: React.ReactNode }) {
  return <View style={[styles.page, styles.contentPage]}>{children}</View>;
}

function FixedStepButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.fixedButtonWrap}>
      <Pressable
        style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <Text style={styles.primaryButtonText}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  page: {
    width,
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingHorizontal: 28,
    paddingTop: 54,
  },
  introPage: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 72,
  },
  contentPage: {
    paddingTop: 100,
    paddingBottom: 150,
  },
  header: {
    position: "absolute",
    left: 28,
    right: 28,
    top: 54,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  introImage: {
    width: 300,
    height: 300,
    marginBottom: 58,
  },
  introTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    letterSpacing: typography.headingLetterSpacing,
    maxWidth: 310,
    textAlign: "center",
  },
  introBody: {
    color: colors.gray,
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    letterSpacing: typography.subheadingLetterSpacing,
    maxWidth: 310,
    marginTop: 16,
    textAlign: "center",
  },
  introButton: {
    borderRadius: 18,
    marginTop: 40,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: colors.navy,
  },
  introButtonText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
  },
  progressPills: {
    flexDirection: "row",
    gap: 9,
  },
  progressPill: {
    width: 49,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.paleTeal,
  },
  progressPillActive: {
    backgroundColor: colors.teal,
  },
  stepText: {
    color: colors.teal,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  heading: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    letterSpacing: typography.headingLetterSpacing,
  },
  subheading: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 18,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 8,
  },
  helpHeading: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 26,
    letterSpacing: typography.headingLetterSpacing,
  },
  helpSubheading: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 18,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 8,
  },
  helpList: {
    gap: 32,
    marginTop: 32,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paleTeal,
  },
  iconBoxLarge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paleTeal,
  },
  iconText: {
    color: colors.teal,
    fontFamily: fontFamilies.bold,
    fontSize: 30,
  },
  helpCopy: {
    flex: 1,
  },
  helpItemTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 18,
    letterSpacing: -1,
  },
  helpItemBody: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  itemTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: -1,
  },
  itemBody: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  helpQuote: {
    color: colors.teal,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    marginTop: 45,
    textAlign: "center",
  },
  boundaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    marginTop: 32,
  },
  boundaryCard: {
    width: 151,
    height: 159,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F6F8",
  },
  noBadge: {
    position: "absolute",
    right: -5,
    bottom: 0,
  },
  boundaryLabel: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    marginTop: 14,
    textAlign: "center",
  },
  quoteBox: {
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 36,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quoteBoxText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    textAlign: "center",
  },
  setupList: {
    gap: 20,
    marginTop: 32,
  },
  setupCard: {
    minHeight: 91,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.offWhite,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  setupCopy: {
    flex: 1,
  },
  setupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  required: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    backgroundColor: "#EDF6FA",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  warningWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 134,
    alignItems: "center",
    paddingHorizontal: 28,
    zIndex: 1,
  },
  fixedButtonWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 66,
    paddingBottom: 68,
    backgroundColor: colors.offWhite,
  },
  warningText: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  primaryButton: {
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: colors.navy,
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
  },
});
