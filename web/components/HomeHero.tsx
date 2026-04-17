import Image from "next/image";

export function HomeHero() {
  return (
    <section className="home-hero">
      <Image
        src="/assets/photos/hero_image.png"
        alt="Manos sosteniendo plantas"
        fill
        priority
        className="home-hero-image"
        sizes="100vw"
      />
      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="home-hero-content">
        <h1>Labs Vivos UC</h1>
        <p>
          Hacer del Campus Universitario un ecosistema vivo de aprendizaje,
          experimentacion y creacion de soluciones integrales y sostenibles.
        </p>

        <div className="home-hero-logos">
          <span>Pontificia Universidad Catolica de Chile</span>
          <span>Headset Institute</span>
        </div>
      </div>
    </section>
  );
}
