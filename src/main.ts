import { defineCustomElement } from 'vue'
import Sintia from './Sintia.ce.vue'

const sintiaAgentElement = document.getElementsByTagName('start-sintia')[0]
const agentId = sintiaAgentElement.getAttribute('id') as string

const SintiaAgent = defineCustomElement(Sintia)

customElements.define('sintia-agent', SintiaAgent)
sintiaAgentElement.appendChild(new SintiaAgent({ agentId: agentId }))
