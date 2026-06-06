import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Vase', value: 'vase'},
          {title: 'Kitchen', value: 'kitchen'},
          {title: 'Home', value: 'home'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          {title: 'Large (60vw)', value: 'large'},
          {title: 'Medium (45vw)', value: 'medium'},
          {title: 'Small (30vw)', value: 'small'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sold',
      title: 'Sold',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      sold: 'sold',
      media: 'image',
    },
    prepare({title, price, sold, media}) {
      return {
        title: title ?? 'Untitled',
        subtitle: `$${price}${sold ? ' — Sold' : ''}`,
        media,
      }
    },
  },
})
