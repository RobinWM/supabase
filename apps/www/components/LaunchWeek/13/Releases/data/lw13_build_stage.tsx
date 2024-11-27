// see apps/www/components/LaunchWeek/X/Releases/data/lwx_advent_days.tsx for reference

import { ReactNode } from 'react'
import { type ClassValue } from 'clsx'

export interface AdventDay {
  icon?: ReactNode // use svg jsx with 34x34px viewport
  className?: ClassValue | string
  id: string
  title: string
  description?: string
  is_shipped: boolean
  links: AdventLink[]
  icons?: AdventLink[]
  type?: string
}

export interface AdventLink {
  url: string
  label?: string
  icon?: any
  target?: '_blank'
}

export const days: AdventDay[] = [
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description:
      'Granular permissions for adding users to specific projects in an Supabase organization',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
  },
  {
    title: '',
    description: '',
    id: '',
    is_shipped: false,
    links: [],
    icon: null,
    className: 'md:col-span-1 lg:col-span-full xl:col-span-3 md:max-h-[250px] xl:max-h-[250px]',
  },
]
