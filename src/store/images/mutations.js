import Vue from 'vue'

export function updateImages (state, value) {
  Vue.set(state, 'items', [...value])
}
