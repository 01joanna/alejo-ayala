export default function Home() {
  return (
    <div className="relative w-screen h-screen z-10 bg-black">
      <iframe
        src="https://player.vimeo.com/video/558780923?background=1&autoplay=1&muted=1&loop=1"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
