import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue-pro'
import nav from '@/_nav.js'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    const renderItem = (item) => {
      console.log(h(resolveComponent('CIcon'), {
        customClassName: 'nav-icon',
        name: item.icon,
      }));
      if (item.items) {
        return h(
          CNavGroup,
          {
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
          RouterLink,
          {
            to: item.to,
            custom: true,
          },
          {
            default: (props) =>
              h(
                resolveComponent(item.component),
                {
                  active: props.isActive,
                  href: props.href,
                  onClick: () => props.navigate(),
                },
                {
                  default: () => [
                    item.icon &&
                      item.icon === 'cil-apps' ? <Inventory /> :
                    h(resolveComponent('CIcon'), {
                      customClassName: 'nav-icon',
                      name: item.icon,
                    })
                    ,
                    item.name,
                    item.badge &&
                    h(
                      CBadge,
                      {
                        class: 'ms-auto',
                        color: item.badge.color,
                      },
                      {
                        default: () => item.badge.text,
                      },
                    ),
                  ],
                },
              ),
          },
        )
        : h(
          resolveComponent(item.component),
          {},
          {
            default: () => item.name,
          },
        )
    }

    return () =>
      h(
        CSidebarNav,
        {},
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      )
  },
})
export { AppSidebarNav }
const Inventory = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" viewBox="0 0 512 512" role="img">undefined<path fill="var(--ci-primary-color, currentColor)" d="M88,32a64,64,0,1,0,64,64A64.072,64.072,0,0,0,88,32Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,88,128Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M256,32a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,32Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,128Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,160a64,64,0,1,0-64-64A64.072,64.072,0,0,0,424,160Zm0-96a32,32,0,1,1-32,32A32.036,32.036,0,0,1,424,64Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M88,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,88,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,88,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M256,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,424,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,424,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M88,352a64,64,0,1,0,64,64A64.072,64.072,0,0,0,88,352Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,88,448Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M256,352a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,352Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,448Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,352a64,64,0,1,0,64,64A64.072,64.072,0,0,0,424,352Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,424,448Z" class="ci-primary"></path></svg>
}