<template>
  <div
    ref="container"
    class="editor"
    @keydown.ctrl.s.prevent="emitChangeEvent"
    @keydown.meta.s.prevent="emitChangeEvent"
  />
</template>

<script setup lang="ts">
import type { ModeSpec, ModeSpecOptions } from 'codemirror'
import { inject, onMounted, ref, watch, watchEffect } from 'vue'
import type { ToRefs } from 'vue'
import type { Props as ReplProps } from '../Repl.vue'
import { debounce } from '../utils'
import CodeMirror from './codemirror'
import { injectKeyProps } from '../../src/types'

export interface Props {
  mode?: string | ModeSpec<ModeSpecOptions>
  value?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'htmlmixed',
  value: '',
  readonly: false,
})

const emit = defineEmits<(e: 'change', value: string) => void>()

const container = ref<HTMLElement | null>(null)
const injected = inject(injectKeyProps)! as ToRefs<
  Required<ReplProps & { autoSave: boolean }>
>
const { autoResize, autoSave } = injected
let editor: CodeMirror.Editor

const emitChangeEvent = () => {
  emit('change', editor.getValue())
}

onMounted(() => {
  const addonOptions = props.readonly
    ? {}
    : {
        autoCloseBrackets: true,
        autoCloseTags: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        keyMap: 'sublime',
      }

  editor = CodeMirror(container.value!, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions,
  })

  watchEffect(() => {
    const cur = editor.getValue()
    if (props.value !== cur) {
      editor.setValue(props.value)
    }
  })

  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  setTimeout(() => {
    editor.refresh()
  }, 50)

  if (autoResize.value) {
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh()
      }),
    )
  }

  watch(
    autoSave,
    (
      autoSaveVal: boolean,
      _old: boolean,
      onCleanup: (fn: () => void) => void,
    ) => {
      if (autoSaveVal) {
        editor.on('change', emitChangeEvent)
        onCleanup(() => editor.off('change', emitChangeEvent))
      }
    },
    { immediate: true },
  )
})
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.CodeMirror {
  font-family: var(--font-code);
  line-height: 1.5;
  height: 100%;
}
</style>
