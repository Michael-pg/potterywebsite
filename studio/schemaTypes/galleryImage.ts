import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Short description of the photo for screen readers.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first on the homepage.',
      initialValue: 100,
    }),
  ],
  orderings: [
    {title: 'Homepage order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'caption', alt: 'alt', order: 'order', media: 'image'},
    prepare({title, alt, order, media}) {
      return {title: title || alt || 'Untitled', subtitle: `Order ${order ?? '—'}`, media}
    },
  },
})
