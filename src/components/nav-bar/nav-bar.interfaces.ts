export interface Link {
  id: string;
  text: string;
  href: string;
}

export interface NavBarProps {
  links: Link[];
}
