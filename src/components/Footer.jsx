function Footer() {
  return (
    <footer className="mt-16 bg-leaf-700 text-leaf-100">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <p className="font-heading text-xl font-semibold">Symbio</p>
        <p className="mt-1 text-sm">Science, living together.</p>
        <p className="mt-4 text-xs opacity-75">
          © {new Date().getFullYear()} Symbio. A school project.
        </p>
      </div>
    </footer>
  )
}

export default Footer