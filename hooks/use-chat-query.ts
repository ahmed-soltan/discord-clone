import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await res.json();
    return jsonResponse;
  };

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchInterval:1000,
    initialPageParam: undefined,
  });

  return {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
  };
};
