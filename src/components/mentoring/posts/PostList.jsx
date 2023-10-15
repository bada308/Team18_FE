import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getPostsReq } from "/src/apis/mentorPost";

import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";

export default function PostList({ category, search }) {
  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", category, search],
      queryFn: ({ pageParam = 0 }) => {
        return getPostsReq(category, search, pageParam);
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.response.length === 0) return undefined;
        return allPages.length;
      },
    });

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isLoading && hasNextPage) fetchNextPage();
  }, [inView, isLoading, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col">
      {data.pages
        .flatMap((page) => page.data.response)
        .map((post) => (
          <PostCard key={`postcard-${post.pid}`} post={post} />
        ))}
      {isFetchingNextPage &&
        Array(3)
          .fill(null)
          .map((_, index) => <PostCardSkeleton key={`skeleton-${index}`} />)}
      <PostCardSkeleton />
      <div ref={ref}></div>
    </div>
  );
}