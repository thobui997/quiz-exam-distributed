export const paths = {
  auth: {
    login: {
      path: '/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    },
    register: {
      path: '/register',
      getHref: () => '/register'
    }
  },

  app: {
    monHoc: {
      path: '/mon-hoc',
      getHref: () => '/mon-hoc'
    }
  }
} as const;
