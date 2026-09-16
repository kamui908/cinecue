import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Cast } from '../types/tmdb';

interface Props {
  cast: Cast[];
}

export function CastList({ cast }: Props) {
  const displayCast = cast.slice(0, 15);

  return (
    <View className="mb-6">
      <Text className="text-white text-lg font-bold px-4 mb-3">Top Billed Cast</Text>
      <View className="flex-row flex-wrap px-4 gap-3">
        {displayCast.map((member) => (
          <Link href={`/person/${member.id}`} key={member.id} asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <View className="w-[100px] items-center">
                <View className="w-[100px] h-[100px] rounded-full overflow-hidden bg-dark-800">
                  {member.profile_path ? (
                    <Image
                      source={{ uri: Images.profile(member.profile_path, 'w185') }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-dark-700 items-center justify-center">
                      <Text className="text-dark-400 text-xl font-bold">
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-white text-[11px] font-semibold mt-2 text-center" numberOfLines={1}>
                  {member.name}
                </Text>
                <Text className="text-dark-400 text-[10px] mt-0.5 text-center" numberOfLines={2}>
                  {member.character}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}
