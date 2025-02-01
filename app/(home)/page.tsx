"use client"
import Image from "next/image";

export default function Home() {
  return (
    <>
      <br />
      <br />
      <div className="justify-items-center w-100%">
        <Image
          src="/logo.webp"
          alt="Artisienne's Logo"
          width={1000}
          height={1000} // Set a height to maintain aspect ratio
          style={{ width: 'auto', height: 'auto' }} // Ensure aspect ratio is maintained
          priority={true}
        />
      </div>
      <br />
      <br />
    </>
  );
}