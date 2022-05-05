import "@logseq/libs";
import "virtual:windi.css";

import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

import { logseq as PL } from "../package.json";
import { IBatchBlock } from "@logseq/libs/dist/LSPlugin.user";

// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);

const pluginId = PL.id;

async function createPage(title: string, blocks: Array<IBatchBlock>) {
  const page = await logseq.Editor.createPage(title, {}, {
      createFirstBlock: true,
      redirect: false
  })
  await new Promise(r => setTimeout(r, 2000))
  const pageBlocksTree = await logseq.Editor.getPageBlocksTree(title)
  if (pageBlocksTree.length > 0) {
      const _first = pageBlocksTree[0]
      await logseq.Editor.insertBatchBlock(_first!.uuid, blocks, {sibling: true})
      logseq.App.showMsg(`Creating: "${title}"`)
      return true
  } else {
      console.log('No page blocks found!')
  }
  return false
}

function main() {
  console.info(`#${pluginId}: MAIN`);
  const root = ReactDOM.createRoot(document.getElementById("app")!);

  
  for (let step = 0; step < 500; step++) {
    logseq.Editor.getPage(`page ${step}`).then(function (page) {
      console.log(page)
      if (page === null) {
        const blocks = [
          {content: `bla ${step}`, children: []},
          {content: `ble ${step}`, children: []},
          {content: `bli ${step}`, children: [
            {content: `blo ${step}`, children: []},
            {content: `blu ${step}`, children: []}
          ]}
        ]
        createPage(`page ${step}`, blocks).then((created) => console.log(created));
      }
    })
    
  }


  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  function createModel() {
    return {
      show() {
        logseq.showMainUI();
      },
    };
  }

  logseq.provideModel(createModel());
  logseq.setMainUIInlineStyle({
    zIndex: 11,
  });

  const openIconName = "template-plugin-open";

  logseq.provideStyle(css`
    .${openIconName} {
      opacity: 0.55;
      font-size: 20px;
      margin-top: 4px;
    }

    .${openIconName}:hover {
      opacity: 0.9;
    }
  `);

  logseq.App.registerUIItem("toolbar", {
    key: openIconName,
    template: `
      <div data-on-click="show" class="${openIconName}">⚙️</div>
    `,
  });
}

logseq.ready(main).catch(console.error);
