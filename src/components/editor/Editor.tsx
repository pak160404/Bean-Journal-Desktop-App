'use client'

import { useState } from 'react'

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  type JSONContent,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  type SuggestionItem
} from 'novel'

import {
  createSlashCommand,
} from '@/components/editor/slash-command'
import EditorMenu from '@/components/editor/editor-menu'
import { createUploadFn } from '@/components/editor/image-upload'
import { createDefaultExtensions } from '@/components/editor/extensions'
import { TextButtons } from '@/components/editor/selectors/text-button'
import { LinkSelector } from '@/components/editor/selectors/link-selector'
import { NodeSelector } from '@/components/editor/selectors/node-selector'
import { MathSelector } from '@/components/editor/selectors/math-selector'
import { ColorSelector } from '@/components/editor/selectors/color-selector'

import { Separator } from '@/components/ui/separator'
import type { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line react-refresh/only-export-components
export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
}

interface EditorProps {
  initialValue?: JSONContent
  onChange: (content: string) => void
  supabase: SupabaseClient
  userId: string
  bucketName: string
}

export default function Editor({ initialValue, onChange, supabase, userId, bucketName }: EditorProps) {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  const currentUploadFn = createUploadFn(supabase, userId, bucketName)
  const configuredSlashCommand = createSlashCommand(currentUploadFn)
  const extensions = createDefaultExtensions(configuredSlashCommand)

  // Get suggestion items for the command list from the configured slash command options
  const itemsForCommandList: SuggestionItem[] = configuredSlashCommand.options.suggestion.items()

  return (
    <div className='relative w-full max-w-screen-lg'>
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialValue}
          extensions={extensions}
          className='min-h-96 rounded-xl border p-4'
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event)
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, currentUploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, currentUploadFn),
            attributes: {
              class:
                'prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl'
            }
          }}
          onUpdate={({ editor }) => {
            const jsonContent = editor.getJSON();
            onChange(JSON.stringify(jsonContent));
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
            <EditorCommandEmpty className='px-2 text-muted-foreground'>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {itemsForCommandList.map((item: SuggestionItem) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={val => item.command?.(val)}
                  className='flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent'
                  key={item.title}
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation='vertical' />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />

            <Separator orientation='vertical' />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation='vertical' />
            <MathSelector />

            <Separator orientation='vertical' />
            <TextButtons />

            <Separator orientation='vertical' />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}