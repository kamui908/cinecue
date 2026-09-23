import React from 'react';
import { ReactNode } from 'react';
import { Platform, ScrollView } from 'react-native';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Center,
  Spinner,
  Badge,
} from './ui/gluestack';
import { Icons } from './Icons';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Section({ title, subtitle, action, children }: SectionProps) {
  return (
    <Box className="mb-6">
      <HStack className="items-center justify-between px-4 mb-3">
        <Box>
          <Text className="text-typography-50 text-lg font-bold">{title}</Text>
          {subtitle && <Text className="text-typography-400 text-xs mt-0.5">{subtitle}</Text>}
        </Box>
        {action}
      </HStack>
      {children}
    </Box>
  );
}

export function HorizontalList({ children }: { children: ReactNode }) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [viewWidth, setViewWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);
  const offsetX = React.useRef(0);
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  // Desktop web has no touch swipe, so offer arrow buttons to page sideways.
  const showArrows = Platform.OS === 'web';
  const canGoLeft = offsetX.current > 8;
  const canGoRight = contentWidth - viewWidth - offsetX.current > 8;

  const scrollBy = (dir: 1 | -1) => {
    const maxX = Math.max(0, contentWidth - viewWidth);
    const next = Math.max(0, Math.min(maxX, offsetX.current + dir * viewWidth * 0.8));
    scrollRef.current?.scrollTo({ x: next, animated: true });
  };

  return (
    <Box className="relative">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentWidth(w)}
        onScroll={(e) => {
          offsetX.current = e.nativeEvent.contentOffset.x;
          forceUpdate();
        }}
        scrollEventThrottle={100}
      >
        {children}
      </ScrollView>
      {showArrows && canGoLeft && (
        <Pressable
          onPress={() => scrollBy(-1)}
          className="absolute left-2 top-1/2 -mt-5 w-10 h-10 rounded-full bg-black/50 items-center justify-center z-10"
          accessibilityLabel="Scroll left"
          accessibilityRole="button"
        >
          <Icons.ChevronLeft size={20} color="#ffffff" />
        </Pressable>
      )}
      {showArrows && canGoRight && (
        <Pressable
          onPress={() => scrollBy(1)}
          className="absolute right-2 top-1/2 -mt-5 w-10 h-10 rounded-full bg-black/50 items-center justify-center z-10"
          accessibilityLabel="Scroll right"
          accessibilityRole="button"
        >
          <Icons.ChevronRight size={20} color="#ffffff" />
        </Pressable>
      )}
    </Box>
  );
}

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const bg =
    rating >= 7.5
      ? 'bg-success-500/20'
      : rating >= 5
        ? 'bg-warning-500/20'
        : 'bg-error-500/20';
  const textColor =
    rating >= 7.5
      ? 'text-success-500'
      : rating >= 5
        ? 'text-warning-500'
        : 'text-error-500';

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <Center className={`${bg} rounded-full ${sizeClasses[size]}`}>
      <HStack className="items-center gap-1">
        <Icons.Star size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} color="currentColor" className={textColor} />
        <Text className={`${textColor} font-bold ${textSize}`}>
          {rating.toFixed(1)}
        </Text>
      </HStack>
    </Center>
  );
}

export function GenreTag({ name }: { name: string }) {
  return (
    <Badge className="bg-background-700 rounded-full px-3 py-1 mr-2 mb-2">
      <Text className="text-typography-400 text-xs">{name}</Text>
    </Badge>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <Center className="py-16 px-8">
      {icon ? (
        <Box className="mb-4">{icon}</Box>
      ) : (
        <Icons.Clapperboard size={48} className="text-typography-400 mb-4" />
      )}
      <Text className="text-typography-50 text-lg font-bold text-center">{title}</Text>
      <Text className="text-typography-400 text-sm text-center mt-2">{message}</Text>
    </Center>
  );
}

export function LoadingSpinner() {
  return (
    <Center className="py-8">
      <Spinner size="large" className="text-primary-500" />
    </Center>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

export function StatItem({ label, value, className }: StatItemProps) {
  return (
    <Center className={`flex-1 ${className ?? ''}`}>
      <Text className="text-typography-50 text-lg font-bold">{value}</Text>
      <Text className="text-typography-400 text-xs mt-1">{label}</Text>
    </Center>
  );
}
