import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Elevate Your Style with Our Exclusive Collections
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover the best fashion, accessories, and more. Shop now and enjoy great deals!
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>

        {/* Right side (optimized image) */}
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src="/Avibranthero.webp"
            alt="Fashion Banner"
            fill
            className="object-cover rounded-xl shadow-lg"
            priority // loads immediately for performance
          />
        </div>
      </div>
    </section>
  );
}
