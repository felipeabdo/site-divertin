export default function Loading() {
  return (
    <main className="divertin-route-skeleton" aria-busy="true" aria-label="Carregando página">
      <div className="divertin-route-skeleton-inner" aria-hidden="true">
        <div className="divertin-route-skeleton-nav"><i /><span /><span /><span /><b /></div>
        <section className="divertin-route-skeleton-hero">
          <div><i /><b /><b /><span /><span /><em /></div>
          <aside />
        </section>
        <section className="divertin-route-skeleton-content"><i /><b /><div><span /><span /><span /></div></section>
      </div>
    </main>
  );
}
