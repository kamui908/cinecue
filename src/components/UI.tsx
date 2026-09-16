import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Section({ title, subtitle, action, children }: SectionProps) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between px-4 mb-3">
        <View>
          <Text className="text-white text-lg font-bold">{title}</Text>
          {subtitle && <Text className="text-dark-400 text-xs mt-0.5">{subtitle}</Text>}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

export function HorizontalList({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
    >
      {children}
    </ScrollView>
  );
}

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const color =
    rating >= 7.5 ? 'bg-accent-emerald' : rating >= 5 ? 'bg-accent-gold' : 'bg-accent-rose';
  const textColor =
    rating >= 7.5 ? 'text-accent-emerald' : rating >= 5 ? 'text-accent-gold' : 'text-accent-rose';

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  return (
    <View className={`${color}/20 rounded-full items-center justify-center ${sizeClasses[size]}`}>
      <Text className={`${textColor} font-bold ${size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'}`}>
        ★ {rating.toFixed(1)}
      </Text>
    </View>
  );
}

export function GenreTag({ name }: { name: string }) {
  return (
    <View className="bg-dark-700 rounded-full px-3 py-1 mr-2 mb-2">
      <Text className="text-dark-300 text-xs">{name}</Text>
    </View>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = '🎬', title, message }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <Text className="text-4xl mb-4">{icon}</Text>
      <Text className="text-white text-lg font-bold text-center">{title}</Text>
      <Text className="text-dark-400 text-sm text-center mt-2">{message}</Text>
    </View>
  );
}

export function LoadingSpinner() {
  return (
    <View className="items-center justify-center py-8">
      <View className="w-8 h-8 border-2 border-dark-600 border-t-primary-500 rounded-full" />
    </View>
  );
}

interface StatItemProps {
  label: string;
  value: string;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <View className="items-center flex-1">
      <Text className="text-white text-lg font-bold">{value}</Text>
      <Text className="text-dark-400 text-xs mt-1">{label}</Text>
    </View>
  );
}
