import { type ReactNode } from 'react';

export default function CategoriesLayout({
  modal,
  children
}: {
  modal: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
