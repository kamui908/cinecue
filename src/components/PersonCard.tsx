import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Person } from '../types/tmdb';

interface Props {
  person: Person;
}

export function PersonCard({ person }: Props) {
  return (
    <Link href={`/person/${person.id}`} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="w-[120px] mr-3 items-center">
          <View className="w-[120px] h-[120px] rounded-full overflow-hidden bg-dark-800">
            {person.profile_path ? (
              <Image
                source={{ uri: Images.profile(person.profile_path, 'w185') }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-dark-700 items-center justify-center">
                <Text className="text-dark-400 text-2xl font-bold">
                  {person.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-white text-xs font-semibold mt-2 text-center" numberOfLines={1}>
            {person.name}
          </Text>
          <Text className="text-dark-400 text-[10px] mt-0.5" numberOfLines={1}>
            {person.known_for_department}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
