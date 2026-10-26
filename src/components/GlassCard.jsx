function GlassCard({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`glass rounded-3xl p-6 ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default GlassCard