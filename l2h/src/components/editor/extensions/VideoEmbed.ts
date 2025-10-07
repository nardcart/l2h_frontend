import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      /**
       * Add a video embed
       */
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: 'videoEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.video-wrapper',
        getAttrs: (dom) => {
          const iframe = (dom as HTMLElement).querySelector('iframe');
          return iframe ? { src: iframe.getAttribute('src') } : false;
        },
      },
      {
        tag: 'iframe[src]',
        getAttrs: (dom) => ({
          src: (dom as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'video-wrapper' },
      [
        'iframe',
        mergeAttributes(this.options.HTMLAttributes, {
          src: HTMLAttributes.src,
          frameborder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: 'true',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});


