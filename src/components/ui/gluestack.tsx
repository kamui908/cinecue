import React from 'react';
import {
  View,
  Text as RNText,
  Pressable as RNPressable,
  Image as RNImage,
  ActivityIndicator,
  TextInput,
} from 'react-native';

export function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

export const Box = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn(className)} {...props} />
));
Box.displayName = 'Box';

export const Text = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <RNText ref={ref} className={cn(className)} {...props} />
));
Text.displayName = 'Text';

export const HStack = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex-row', className)} {...props} />
));
HStack.displayName = 'HStack';

export const VStack = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex-col', className)} {...props} />
));
VStack.displayName = 'VStack';

export const Center = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn('items-center justify-center', className)}
    {...props}
  />
));
Center.displayName = 'Center';

export const Pressable = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => (
    <RNPressable ref={ref} className={cn(className)} {...props} />
  )
);
Pressable.displayName = 'Pressable';

export const Image = React.forwardRef<any, any>((props, ref) => (
  <RNImage ref={ref} {...props} />
));
Image.displayName = 'Image';

export const Spinner = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => (
    <ActivityIndicator
      ref={ref}
      className={cn(className)}
      color={props.color ?? '#ef4444'}
      {...props}
    />
  )
);
Spinner.displayName = 'Spinner';

export const Badge = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn(className)} {...props} />
));
Badge.displayName = 'Badge';

export const Divider = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('h-px w-full bg-background-200', className)} {...props} />
));
Divider.displayName = 'Divider';

export const Input = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'flex-row items-center border border-background-200 rounded-lg bg-background-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const InputField = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => (
    <TextInput
      ref={ref}
      className={cn('flex-1 px-3 py-2 text-typography-900', className)}
      placeholderTextColor="#94a3b8"
      {...props}
    />
  )
);
InputField.displayName = 'InputField';

export const GluestackUIProvider = React.Fragment;