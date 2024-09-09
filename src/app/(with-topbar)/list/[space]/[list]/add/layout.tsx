import { type ReactNode } from 'react';

export default function AddListItemLayout({
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
