
class Node {
    //returns the path from the given node
    static getPath(node) {
        let path = [];
        let parent;
        if (node === document.documentElement) return path;
        while (node !== document.body) {
            parent = node.parentNode;
            let idx = Array.prototype.indexOf.call(parent.childNodes, node);
            path.push(idx);
            node = parent;
        }
        return path;
    }
    //returns a node from path
    static getNode(path) {
        let node = document.body;
        for (let idx = path.length - 1; idx >= 0; idx--) {
            if (!node) return null;
            node = node.childNodes[path[idx]];
        }
        return node;
    }
    //check if a node is a blankspaces node
    static isaWhiteNode(node) {
        return !/[^\t\n\r ]/.test(node.textContent);
    }
    //check if a node is text node
    static isaTextNode(node) {
        try {
            return node.nodeType === 3;
        }
        catch (err) {
            return 0;
        }
    }
    static isHighlighted(node) {
        return node.parentNode.classList.contains("highlighted");
    }
}

class Path {
    constructor(selection) {
        this.anchorPath = Node.getPath(selection.anchor);
        this.anchorOffset = selection.anchorOffset;
        this.containerPath = Node.getPath(selection.container);
        this.focusPath = Node.getPath(selection.focus);
        this.focusOffset = selection.focusOffset;
        this.color = selection.color;
        this.tms = selection.tms;
        this.status = selection.status;
    }

    static buildFromPaht(path) {
        return new Selection(
            Node.getNode(this.anchorPath),
            this.anchorOffset,
            Node.getNode(this.containerPath),
            Node.getNode(this.focusPath),
            this.focusOffset,
            this.color
        );
    }
}

class Selection {
    constructor(anchor, anchorOffset, container, focus, focusOffset, color, tms, status = true) {
        this.dir = this.getSelectionDirection(anchor, anchorOffset, focus, focusOffset);
        this.anchor = this.dir === "backward" ? focus : anchor;
        this.anchorOffset = this.dir === "backward" ? focusOffset : anchorOffset;
        this.container = container;
        this.focus = this.dir === "backward" ? anchor : focus;
        this.focusOffset = this.dir === "backward" ? anchorOffset : focusOffset;
        this.mode = this.getSelectionMode();
        this.color = color;
        this.tms = tms || Date.now().toString();
        this.status = status;
    }

    getSelectionMode() {
        return this.anchor === this.focus ? "INDIVIDUAL" : "MULTIPLE";
    }

    getSelectionDirection(anchor, anchorOffset, focus, focusOffset) {
        try{
            let range = document.createRange();
            range.setStart(anchor, anchorOffset);
            range.setEnd(focus, focusOffset);
            let backwards = range.collapsed;
            return backwards ? "backward" : "forward";
        }catch(err){
            console.log(err);
            return "forward";
        }
    }

    getSelectedNodes = () => {
        let selected = [];
        let anchor = this.anchor;
        let container = this.container;
        let focus = this.focus;

        const nodeIterator = document.createNodeIterator(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!Node.isaWhiteNode(node)) {
                        if (node === anchor) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        else if (node === focus) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        else if (node.compareDocumentPosition(anchor) == 2 && node.compareDocumentPosition(focus) == 4) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        else {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    else {
                        return NodeFilter.FILTER_REJECT;

                    }
                }
            }
        );
        let node = nodeIterator.nextNode();
        while (node) {
            selected.push(node);
            node = nodeIterator.nextNode();
        };
        return selected;
    }

    //return a path from node
    static getFromPath(selectionPath) {
        return {
            dir: selectionNode.dir,
            anchor: selectionNode.dir,
            anchorOffset: selectionNode.anchorOffset,
            container: Node.getPath(selectionNode.container),
            focus: Node.getPath(selectionNode.focus),
            focusOffset: selectionNode.focusOffset
        }
    }

    selectionBuilder() {

    }

    static buildFromSelection(selection, color) {
        let anchorNode = selection.anchorNode;
        let anchorOffset = selection.anchorOffset;
        let container = selection.getRangeAt(0).commonAncestorContainer;
        let focusNode = selection.focusNode;
        let focusOffset = selection.focusOffset;

        return new Selection(anchorNode, anchorOffset, container, focusNode, focusOffset, color);
    }

    static buildFromPath(path) {
        return new Selection(
            Node.getNode(path.anchorPath),
            path.anchorOffset,
            Node.getNode(path.containerPath),
            Node.getNode(path.focusPath),
            path.focusOffset,
            path.color,
            path.tms,
            path.status
        );
    }

    static isEmpty(selection) {
        return selection.type != "Range" && selection.anchorOffset == 0 && selection.anchorNode == 0;
    }

}

function getLowestCommonParent(node_a, node_b) {
    while (node_a = node_a.parentElement) {
        if (node_a.contains(node_b)) {
            return node_a;
        }
    }
    return null;
}

class Hihglighter {
    constructor(htmlEl, options) {
        this.htmlEl = htmlEl;
        this.color = options.color || "ff000050";
        this.storage = new Storage();
    }

    highlight(node, start, end, color, tms) {
        let frag = document.createDocumentFragment();
        let anchorText = document.createTextNode("text");
        let hihglightText = document.createElement("span");
        let focusText = document.createTextNode("text");
        let text = node.nodeValue;

        anchorText.textContent = text.substring(0, start);

        hihglightText.style.setProperty("--color", color);
        hihglightText.classList.add("highlighted");
        hihglightText.classList.add("visible");
        hihglightText.dataset.tms = tms;
        hihglightText.textContent = text.substring(start, end);

        focusText.textContent = text.substring(end);

        frag.appendChild(anchorText);
        frag.appendChild(hihglightText);
        frag.appendChild(focusText)
        node.replaceWith(frag);
    }

    filterHighlights = (selection) => {
        const selectedNodes = selection.getSelectedNodes();
        const anchor = selection.anchor;
        const anchorOffset = selection.anchorOffset;
        const focus = selection.focus;
        const focusOffset = selection.focusOffset;
        const mode = selection.mode;
        const tms = selection.tms;

        selectedNodes.forEach(node => {
            let textLenght = node.nodeValue.length;

            if (node === anchor) {
                // console.log("anchor")
                if (mode === "INDIVIDUAL")
                    this.highlight(node, anchorOffset, focusOffset, selection.color, tms);
                else
                    this.highlight(node, anchorOffset, textLenght, selection.color, tms);
            }
            else if (node === focus) {
                // console.log("focus")
                this.highlight(node, 0, focusOffset, selection.color, tms);
            }
            else {
                // console.log("middle")
                this.highlight(node, 0, textLenght, selection.color, tms);
            }
        });

    }

    highlighter = () => {
        try {
            if (window.getSelection().type !== "Range") return;

            const selection = new Selection(
                window.getSelection().anchorNode,
                window.getSelection().anchorOffset,
                window.getSelection().getRangeAt(0).commonAncestorContainer,
                window.getSelection().focusNode,
                window.getSelection().focusOffset,
                this.color,
            );
            this.storage.save(selection);
            this.filterHighlights(selection);

        } catch (err) {
            console.error(err);
        } finally {
            window.getSelection().removeAllRanges();
        }
    }

    runHighlighter() {
        this.htmlEl.addEventListener("mouseup", this.highlighter)
    }

    stopHighlighter() {
        this.htmlEl.removeEventListener("mouseup", this.highlighter);
    }

    delete(removed) {
        let removedParent = removed.anchor.parentNode;
        let textFragments = document.createTextNode(removed.getSelectedNodes().map(el=>el.textContent).join(""));
        removedParent.replaceWith(textFragments)
    }

    erase = (e) => {
        if (e.target.matches(".highlighted")) {
            let sel = e.target;

            let anchor = sel.firstChild;
            let container = getLowestCommonParent(sel, sel);
            let focus = sel.lastChild;
            let aof = 0;
            let fof = focus.textContent.length;

            let removed = new Selection(
                anchor,
                aof,
                container,
                focus,
                fof,
                "",
                Date.now(),
                false
            );
            this.storage.save(removed);
            this.delete(removed)
        }
    }

    runEraser() {
        console.log("Enable eraser")
        this.stopHighlighter();
        this.htmlEl.querySelectorAll(".highlighted").forEach(el => el.classList.add("eraser"));
        this.htmlEl.addEventListener("click", this.erase);
    }

    stopEraser() {
        console.log("Disable eraser")
        this.htmlEl.removeEventListener("click", this.erase);
        this.htmlEl.querySelectorAll(".highlighted").forEach(el => el.classList.remove("eraser"));
        this.runHighlighter();
    }


    initHighlights() {
        const stored = this.storage.getAll();
        stored.forEach(path => {
            let selection = Selection.buildFromPath(path);
            if(selection.status)
                this.filterHighlights(selection);
            else
                this.delete(selection)
        });
    }
    hideHighlights() {
        document.querySelectorAll(".highlighted").forEach(el => {
            el.classList.remove("visible");
        })
    }
    showHighlights() {
        document.querySelectorAll(".highlighted").forEach(el => {
            el.classList.add("visible");
        })
    }
    setColor(color) {
        this.color = color;
    }
}

class Storage {
    constructor() {
        this.url = window.location.href;
        this.storageState = this.initStorage();
    }

    initStorage() {
        try {
            if (!localStorage.getItem(this.url))
                localStorage.setItem(this.url, JSON.stringify([]));
            return true;
        }
        catch (err) {
            console.log(err);
        }
    }

    addToStorage(item) {
        let savedItems = JSON.parse(localStorage.getItem(this.url));
        savedItems.push(item);
        localStorage.setItem(this.url, JSON.stringify(savedItems));
    }

    save(selection) {
        const path = new Path(selection);
        this.addToStorage(path);
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.url));
    }

    delete() {

    }

    update() {
    }
}