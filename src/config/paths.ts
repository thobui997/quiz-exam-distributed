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
    },
    khoa: {
      path: '/khoa',
      getHref: () => '/khoa'
    },
    lop: {
      path: '/lop',
      getHref: () => '/lop'
    }
  }
} as const;
