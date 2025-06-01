import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  Youtube,
  Mathematics,
  UploadImagesPlugin,
} from "novel";
import { Markdown } from "tiptap-markdown";

import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted editor-image-preview"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose my-2 leading-normal"),
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-2"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx(
        "list-disc list-outside leading-normal pl-5 my-2 block"
      ),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx(
        "list-decimal list-outside my-2 leading-normal pl-6 block"
      ),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal mb-1"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 p-1 border-primary bg-secondary/100"),
    },
  },
  bold: {
    HTMLAttributes: {
      class: cx("font-bold"),
    },
  },
  italic: {
    HTMLAttributes: {
      class: cx("italic"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  heading: {
    levels: [1, 2, 3],
    HTMLAttributes: ({ level }: { level: number }) => {
      const classes: { [key: number]: string } = {
        1: "text-3xl font-bold",
        2: "text-2xl font-bold",
        3: "text-xl font-bold",
      };
      return { class: cx(classes[level] || "font-bold") };
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
  codeBlock: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
  // common: covers 37 language grammars which should be good enough in most cases
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx("not-prose"),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

// Configure Markdown extension using Markdown from tiptap-markdown
const MarkdownExtension = Markdown.configure({
  html: true,
  tightLists: true,
  tightListClass: "tight",
  bulletListMarker: "*",
  linkify: true,
  breaks: true,
});

// Modified to accept a configured slash command instance
// Using `any` for slashCommandInstance type for now, as specific Command type from Novel isn't immediately clear
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDefaultExtensions = (slashCommandInstance: any) => {
  return [
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    slashCommandInstance,
    codeBlockLowlight,
    youtube,
    twitter,
    mathematics,
    characterCount,
    TiptapUnderline,
    MarkdownExtension,
    HighlightExtension,
    TextStyle,
    Color,
    CustomKeymap,
    GlobalDragHandle,
  ];
};
