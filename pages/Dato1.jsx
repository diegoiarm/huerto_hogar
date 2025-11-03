function Dato1() {
  return (
    <main className="dato1-main">
      <section className="py-5">
        <div className="container">
          <div className="section-bg">
            <h1>¿Sabías que…?</h1>

            <p className="text-secondary">
              En <strong>HuertoHogar</strong> cuidamos que nuestros productos no
              viajen grandes distancias. De hecho, en promedio, cada pedido
              recorre menos de <strong>150 km</strong> desde el campo hasta tu
              hogar. Esto no solo garantiza que lleguen más frescos y con mejor
              sabor, sino que también ayuda a reducir la{" "}
              <strong>huella de carbono</strong> en comparación con productos
              importados o que pasan por largas cadenas de distribución. Al
              apoyar a agricultores locales, promovemos la economía regional y
              reducimos el impacto ambiental. ¡Cada compra que haces ayuda a
              construir un futuro más sostenible!
            </p>

            <img
              src="/img/cajondev.webp"
              className="img-blog float-start me-5 mb-5 rounded"
              alt="Dato curioso 1"
            />

            <p className="text-secondary">
              Pero no es solo una cuestión de distancia, también es de{" "}
              <strong>confianza</strong> y <strong>calidad</strong>. Al trabajar
              directamente con pequeños y medianos productores, aseguramos que
              los alimentos provengan de campos donde se cultiva con cuidado,
              respeto por la tierra y métodos responsables. Cada fruta, verdura
              o producto que recibes ha pasado por menos intermediarios, lo que
              significa mayor trazabilidad y transparencia para ti y tu familia.
            </p>

            <p className="text-secondary">
              Además, comprar local significa recuperar el verdadero ritmo de la
              naturaleza: productos de temporada, cosechados en el momento
              justo, que conservan mejor sus nutrientes y sabores auténticos.
              Así, disfrutas de lo mejor de cada estación mientras contribuyes a
              un modelo de consumo más consciente. Con cada pedido, no solo
              estás alimentando tu mesa, también estás apoyando a quienes
              trabajan la tierra con dedicación y fomentando un sistema
              alimentario más justo, responsable y cercano.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="text-center">
          <a href="/blog" class="btn btn-secondary mt-3">
            Volver al Blog
          </a>
        </div>
      </section>
    </main>
  );
}

export default Dato1;
