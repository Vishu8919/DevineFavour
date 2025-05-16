'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const SortOptions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    if (sortBy) {
      params.set('sortBy', sortBy);
    } else {
      params.delete('sortBy');
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get('sortBy') || ''}
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
