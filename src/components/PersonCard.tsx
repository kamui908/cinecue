import React from 'react';
import { Box, Text, VStack, Pressable, Image } from './ui/gluestack';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Person } from '../types/tmdb';

interface Props {
  person: Person;
}

export function PersonCard({ person }: Props) {
  return (
    <Link href={`/person/${person.id}`} asChild>
      <Pressable>
        <VStack className="w-[120px] mr-3 items-center">
          <Box className="w-[120px] h-[120px] rounded-full overflow-hidden bg-background-800">
            {person.profile_path ? (
              <Image
                source={{ uri: Images.profile(person.profile_path, 'w185') }}
                className="w-full h-full"
                resizeMode="cover"
                alt="Profile"
              />
            ) : (
              <Box className="w-full h-full bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-2xl font-bold">
                  {person.name.charAt(0)}
                </Text>
              </Box>
            )}
          </Box>
          <Text className="text-typography-50 text-xs font-semibold mt-2 text-center" numberOfLines={1}>
            {person.name}
          </Text>
          <Text className="text-typography-400 text-2xs mt-0.5" numberOfLines={1}>
            {person.known_for_department}
          </Text>
        </VStack>
      </Pressable>
    </Link>
  );
}
