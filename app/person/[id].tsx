import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { usePersonDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, LoadingSpinner } from '../../src/components/UI';
import { ScrollView } from 'react-native';
import { formatDate, formatNumber } from '../../src/utils/format';
import { MovieCast, TVCast } from '../../src/types/tmdb';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Image,
  Badge,
  Divider,
  Center,
} from '../../src/components/ui/gluestack';
import { Icons } from '../../src/components/Icons';
import { useTheme } from '../../src/theme/ThemeContext';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  const { resolved } = useTheme();
  const { data: person, isLoading } = usePersonDetail(personId);

  if (isLoading) return <LoadingSpinner />;
  if (!person) return null;

  const movieCredits = person.combined_credits.cast
    .filter((c): c is MovieCast => 'title' in c && 'character' in c)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 15);

  const tvCredits = person.combined_credits.cast
    .filter(
      (c): c is TVCast =>
        'name' in c && 'character' in c && !('title' in c)
    )
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 15);

  const crewCredits = person.combined_credits.crew
    .filter(
      (c) =>
        c.department === 'Directing' || c.department === 'Writing'
    )
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 10);

  return (
    <ScrollView
      className="flex-1 bg-background-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 bg-background-900/80 rounded-full p-2"
      >
        <Icons.ChevronLeft size={20} color={resolved === 'dark' ? '#f5f5f5' : '#18181b'} />
      </Pressable>

      {/* Profile Image + Info */}
      <Center className="px-4 pt-16 pb-6">
        <Box className="w-36 h-36 rounded-full overflow-hidden bg-background-800 mb-4">
          {person.profile_path ? (
            <Image
              source={{
                uri: Images.profile(person.profile_path, 'h632'),
              }}
              className="w-full h-full"
              resizeMode="cover"
              alt={person.name}
            />
          ) : (
            <Center className="w-full h-full bg-background-700">
              <Text className="text-typography-400 text-4xl font-bold">
                {person.name.charAt(0)}
              </Text>
            </Center>
          )}
        </Box>
        <Text className="text-typography-50 text-2xl font-bold text-center">
          {person.name}
        </Text>
        <Text className="text-typography-400 text-sm mt-1">
          {person.known_for_department}
        </Text>

        {/* Stats */}
        <HStack className="mt-4 bg-background-800 rounded-2xl px-6 py-3">
          <Center className="mx-4">
            <HStack className="items-center gap-1">
              <Icons.Star size={14} color="#ef4444" />
              <Text className="text-typography-50 text-lg font-bold">
                {formatNumber(person.popularity)}
              </Text>
            </HStack>
            <Text className="text-typography-400 text-[10px]">
              Popularity
            </Text>
          </Center>
          {person.birthday && (
            <Center className="mx-4">
              <Text className="text-typography-50 text-sm font-semibold">
                {formatDate(person.birthday, 'MMM D, YYYY')}
              </Text>
              <Text className="text-typography-400 text-[10px]">Born</Text>
            </Center>
          )}
          {person.deathday && (
            <Center className="mx-4">
              <Text className="text-typography-50 text-sm font-semibold">
                {formatDate(person.deathday, 'MMM D, YYYY')}
              </Text>
              <Text className="text-typography-400 text-[10px]">Died</Text>
            </Center>
          )}
        </HStack>
      </Center>

      {/* Biography */}
      {person.biography ? (
        <VStack className="px-4 mb-6">
          <Text className="text-typography-50 text-base font-bold mb-2">
            Biography
          </Text>
          <Text className="text-typography-300 text-sm leading-5">
            {person.biography}
          </Text>
        </VStack>
      ) : null}

      {/* Place of Birth */}
      {person.place_of_birth && (
        <HStack className="px-4 mb-6 items-center gap-2">
          <Icons.MapPin size={14} color="#8c8c8c" />
          <Text className="text-typography-50 text-sm font-semibold">
            {person.place_of_birth}
          </Text>
        </HStack>
      )}

      {/* Also Known As */}
      {person.also_known_as.length > 0 && (
        <VStack className="px-4 mb-6">
          <Text className="text-typography-50 text-sm font-bold mb-2">
            Also Known As
          </Text>
          <HStack className="flex-wrap gap-2">
            {person.also_known_as.map((name, i) => (
              <Badge
                key={i}
                className="bg-background-800 rounded-full px-3 py-1"
              >
                <Text className="text-typography-300 text-xs">{name}</Text>
              </Badge>
            ))}
          </HStack>
        </VStack>
      )}

      {/* Acting Credits */}
      {movieCredits.length > 0 && (
        <Section
          title="Acting"
          subtitle={`${movieCredits.length} movies`}
        >
          <HorizontalList>
            {movieCredits.map((credit) => (
              <MovieCard
                key={credit.id}
                movie={{
                  id: credit.id,
                  title: (credit as any).title,
                  original_title: (credit as any).title,
                  overview: '',
                  poster_path: credit.poster_path,
                  backdrop_path: null,
                  release_date: (credit as any).release_date || '',
                  vote_average: credit.vote_average,
                  vote_count: 0,
                  genre_ids: credit.genre_ids || [],
                  popularity: 0,
                  adult: false,
                  original_language: 'en',
                }}
                variant="backdrop"
              />
            ))}
          </HorizontalList>
        </Section>
      )}

      {/* TV Credits */}
      {tvCredits.length > 0 && (
        <Section
          title="TV Appearances"
          subtitle={`${tvCredits.length} shows`}
        >
          <HorizontalList>
            {tvCredits.map((credit) => (
              <TVCard
                key={credit.id}
                show={{
                  id: credit.id,
                  name: (credit as any).name,
                  original_name: (credit as any).name,
                  overview: '',
                  poster_path: credit.poster_path,
                  backdrop_path: null,
                  first_air_date: (credit as any).first_air_date || '',
                  vote_average: credit.vote_average,
                  vote_count: 0,
                  genre_ids: credit.genre_ids || [],
                  popularity: 0,
                  original_language: 'en',
                }}
                variant="backdrop"
              />
            ))}
          </HorizontalList>
        </Section>
      )}

      {/* Crew Credits */}
      {crewCredits.length > 0 && (
        <Section title="Crew" subtitle="Behind the camera">
          <HorizontalList>
            {crewCredits.map((credit, i) => (
              <Box
                key={`${credit.id}-${i}`}
                className="w-[200px] mr-3 bg-background-800 rounded-xl p-3"
              >
                <Text
                  className="text-typography-50 text-sm font-semibold"
                  numberOfLines={1}
                >
                  {(credit as any).title || (credit as any).name}
                </Text>
                <Text className="text-primary-400 text-xs mt-1">
                  {credit.job}
                </Text>
                <HStack className="items-center mt-2">
                  <Icons.Star size={12} color="#f59e0b" />
                  <Text className="text-typography-50 text-xs ml-1">
                    {credit.vote_average.toFixed(1)}
                  </Text>
                </HStack>
              </Box>
            ))}
          </HorizontalList>
        </Section>
      )}
    </ScrollView>
  );
}
