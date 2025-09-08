import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const { width, height } = Dimensions.get("window");

interface BubbleProps {
  delay: number;
  size: number;
  x: number;
  duration?: number;
}

const Bubble: React.FC<BubbleProps> = ({ delay, size, x, duration = 8000 }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -size,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.9,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Reset instantly back down
        Animated.timing(translateY, {
          toValue: height,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    anim.start();
    return () => anim.stop();
  }, [translateY, delay, size, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          left: x,
          borderRadius: size / 2,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      {/* Gradient to create glossy depth */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.8)",
          "rgba(173,216,230,0.4)",
          "rgba(255,255,255,0.1)",
        ]}
        style={styles.gradient}
      />

      {/* Small highlight dot */}
      <View
        style={[
          styles.highlight,
          {
            top: size * 0.2,
            left: size * 0.25,
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: size * 0.1,
          },
        ]}
      />
    </Animated.View>
  );
};



export default function BubblesBackground({ children }: { children: React.ReactNode }) {
  const bubbles = Array.from({ length: 12 }).map((_, i) => ({
    size: Math.round(Math.random() * 40 + 30),
    x: Math.round(Math.random() * (width - 60)),
    delay: Math.round(Math.random() * 5000),
    duration: 7000 + Math.round(Math.random() * 4000),
  }));

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#6DD5FA", "#2980B9", "#001F54"]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={styles.background}
      />

      {/* Floating Bubbles */}
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}

      {/* Content Overlay */}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  gradient: {
    flex: 1,
    borderRadius: 999,
  },
  highlight: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.9)",
    opacity: 0.7,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});

