import Image from "next/image";
import Link from "next/link";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row flex-wrap gap-8">

        {/* Women's Collection */}
        <div className="relative flex-1 min-w-[300px]">
          <Link href="/collections/all?gender=Women">
            <div className="relative w-full h-[500px]">
              <Image
                src="/images/womenscollection.webp"
                alt="Women's Collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
          </Link>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women&apos;s Collection
            </h2>
            <Link href="/collections/all?gender=Women" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative flex-1 min-w-[300px]">
          <Link href="/collections/all?gender=Men">
            <div className="relative w-full h-[500px]">
              <Image
                src="/images/menscollection.webp"
                alt="Men's Collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
          </Link>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men&apos;s Collection
            </h2>
            <Link href="/collections/all?gender=Men" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Kids' Collection */}
        <div className="relative flex-1 min-w-[300px]">
          <Link href="/collections/all?gender=Kids">
            <div className="relative w-full h-[500px]">
              <Image
                src="/images/kidscollection.webp"
                alt="Kids' Collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
          </Link>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Kids Collection
            </h2>
            <Link href="/collections/all?gender=Kids" className="text-gray-900 underline">
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GenderCollectionSection;
