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
    khoaLop: {
      path: '/khoa-lop',
      getHref: () => '/khoa-lop'
    },
    sinhVien: {
      path: '/sinh-vien',
      getHref: () => '/sinh-vien'
    },
    giaoVien: {
      path: '/giao-vien',
      getHref: () => '/giao-vien'
    }
  }
} as const;
