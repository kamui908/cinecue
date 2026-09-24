import React from 'react';
import { Box, Text, VStack, Pressable, Image, HStack } from './ui/gluestack';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Cast } from '../types/tmdb';

interface Props {
  cast: Cast[];
}

export function CastList({ cast }: Props) {
  const displayCast = cast.slice(0, 15);

  return (
    <Box className="mb-6">
      <Text className="text-typography-50 text-lg font-bold px-4 mb-3">Top Billed Cast</Text>
      <HStack className="flex-wrap justify-between px-4 gap-3">
        {displayCast.map((member) => (
          <Link href={`/person/${member.id}`} key={member.id} asChild>
            <Pressable>
              <VStack className="w-[100px] items-center">
                <Box className="w-[100px] h-[100px] rounded-full overflow-hidden bg-background-800">
                  {member.profile_path ? (
                    <Image
                      source={{ uri: Images.profile(member.profile_path, 'w185') }}
                      className="w-full h-full"
                      resizeMode="cover"
                      alt="Profile"
                    />
                  ) : (
                    <Box className="w-full h-full bg-background-700 items-center justify-center">
                      <Text className="text-typography-400 text-xl font-bold">
                        {member.name.charAt(0)}
                      </Text>
                    </Box>
                  )}
                </Box>
                <Text className="text-typography-50 text-xs font-semibold mt-2 text-center" numberOfLines={1}>
                  {member.name}
                </Text>
                <Text className="text-typography-400 text-2xs mt-0.5 text-center" numberOfLines={2}>
                  {member.character}
                </Text>
              </VStack>
            </Pressable>
          </Link>
        ))}
      </HStack>
    </Box>
  );
}
