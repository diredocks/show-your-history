interface IconProps {
  src: string;
  size?: number;
  class?: string;
}

export default function Icon(props: IconProps) {
  return (
    <span
      class={props.class ? `icon ${props.class}` : 'icon'}
      style={{ width: `${props.size ?? 16}px`, height: `${props.size ?? 16}px` }}
      innerHTML={props.src}
    />
  );
}
