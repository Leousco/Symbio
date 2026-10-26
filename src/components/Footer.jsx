function Footer() {
  return (
    <footer className="mt-16 px-4 pb-4">
      <div className="glass mx-auto max-w-6xl rounded-3xl px-4 py-8 text-center">
        <p className="font-heading text-xl font-semibold">Symbio</p>
        <p className="mt-1 text-sm text-bark/80">Science, living together.</p>
        <p className="mt-4 text-xs text-bark/60">
          © {new Date().getFullYear()} Symbio. A school project.
        </p>
      </div>
    </footer>
  )
}

export default Footer