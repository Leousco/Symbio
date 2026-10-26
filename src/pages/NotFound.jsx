import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2">We couldn't find that page.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white">
        Back to Home
      </Link>
    </section>
  )
}

export default NotFound