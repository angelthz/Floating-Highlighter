
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

class Path{
    constructor(selection){
        this.anchorPath = Node.getPath(selection.anchor);
        this.anchorOffset = selection.anchorOffset;
        this.containerPath = Node.getPath(selection.container);
        this.focusPath = Node.getPath(selection.focus);
        this.focusOffset = selection.focusOffset;
        this.color = selection.color;
    }

    static buildFromPaht(path){
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
    constructor(anchor, anchorOffset, container, focus, focusOffset, color) {
        this.dir = this.getSelectionDirection(anchor, anchorOffset, focus, focusOffset);
        this.anchor = this.dir === "backward" ? focus : anchor;
        this.anchorOffset =  this.dir === "backward" ? focusOffset : anchorOffset;
        this.container = container;
        this.focus =  this.dir === "backward" ? anchor : focus;
        this.focusOffset = this.dir === "backward" ? anchorOffset : focusOffset;
        this.mode = this.getSelectionMode();
        this.color = color;
    }

    getSelectionMode() {
        return this.anchor === this.focus ? "INDIVIDUAL" : "MULTIPLE";
    }

    getSelectionDirection(anchor, anchorOffset, focus, focusOffset) {
        let range = document.createRange();
        range.setStart(anchor, anchorOffset);
        range.setEnd(focus, focusOffset);
        let backwards = range.collapsed;
        return backwards ? "backward" : "forward";
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
    static getFromPath(selectionPath){
        return {
            dir : selectionNode.dir,
            anchor : selectionNode.dir,
            anchorOffset: selectionNode.anchorOffset,
            container : Node.getPath(selectionNode.container),
            focus : Node.getPath(selectionNode.focus),
            focusOffset : selectionNode.focusOffset
        }
    }

    selectionBuilder(){

    }

    static buildFromSelection(selection, color){
        let anchorNode = selection.anchorNode;
        let anchorOffset = selection.anchorOffset;
        let container = selection.getRangeAt(0).commonAncestorContainer;
        let focusNode = selection.focusNode;
        let focusOffset = selection.focusOffset;
        
        return new Selection(anchorNode, anchorOffset, container, focusNode, focusOffset, color);
    }

    static buildFromPath(path){
        return new Selection(
            Node.getNode(path.anchorPath),
            path.anchorOffset,
            Node.getNode(path.containerPath),
            Node.getNode(path.focusPath),
            path.focusOffset,
            path.color
        );
    }

    static isEmpty(selection){
        return selection.type != "Range"  && selection.anchorOffset == 0 && selection.anchorNode == 0;
    }

}


class Hihglighter {
    constructor(htmlEl, options) {
        this.htmlEl = htmlEl;
        this.selection = null;
        this.color = options.color || "ff000050";
        this.storage = new Storage();
        // this.showHighlights();
    }

    highlight(node, start, end, color) {
        let frag = document.createDocumentFragment();
        let anchorText = document.createTextNode("text");
        let hihglight = document.createElement("span");
        let focusText = document.createTextNode("text");
        let text = node.nodeValue;

        hihglight.style.backgroundColor = color;
        hihglight.classList.add("highlighted");

        anchorText.textContent = text.substring(0, start);
        frag.appendChild(anchorText);

        hihglight.textContent = text.substring(start, end);
        frag.appendChild(hihglight);


        focusText.textContent = text.substring(end);
        frag.appendChild(focusText)

        node.replaceWith(frag);

    }

    filterHighlights = (selection)=>{
        const selectedNodes = selection.getSelectedNodes();
        const anchor = selection.anchor;
        const anchorOffset = selection.anchorOffset;
        const focus = selection.focus;
        const focusOffset = selection.focusOffset;
        const mode = selection.mode;

        selectedNodes.forEach(node => {
            let textLenght = node.nodeValue.length;
            
            if (node === anchor) {
                // console.log("anchor")
                if (mode === "INDIVIDUAL")
                    this.highlight(node, anchorOffset, focusOffset, selection.color);
                else
                    this.highlight(node, anchorOffset, textLenght, selection.color);
            }
            else if (node === focus) {
                // console.log("focus")
                this.highlight(node, 0, focusOffset, selection.color);
            }
            else {
                // console.log("middle")
                this.highlight(node, 0, textLenght, selection.color);
            }
        });
    }

    highlighter = () => {
        try {
            if(window.getSelection().type !== "Range") return;
            // console.log(Selection.isEmpty(window.getSelection()))
            console.log(window.getSelection().type)
            // console.log(window.getSelection().anchorOffset)
            // console.log(window.getSelection().focusOffset)
            // console.log(window.getSelection().isCollapsed)
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
        } finally{
            window.getSelection().removeAllRanges();
        }
    }

    runHighlighter() {
        this.htmlEl.addEventListener("mouseup", this.highlighter)
    }

    stopHighlighter() {
        this.htmlEl.removeEventListener("mouseup", this.highlighter);
    }

    erase = (e) => {
        if (e.target.matches(".highlighted")) {
            let textContent = e.target.textContent;
            e.target.outerHTML = textContent;
        }
    }

    runEraser() {
        console.log("Enable eraser")
        // this.eraserState = true;
        this.stopHighlighter();
        this.htmlEl.addEventListener("click", this.erase);
    }

    stopEraser() {
        console.log("Disable eraser")
        this.htmlEl.removeEventListener("click", this.erase);
        this.runHighlighter();
        // this.eraserState = false;
    }

    showHighlights(){
        const stored = this.storage.getAll();
        console.log(stored)
        stored.forEach(path => {
            let selection = Selection.buildFromPath(path);
            console.log(selection)
            this.filterHighlights(selection);
        });
    }
    hideHighlights(){
        document.querySelectorAll(".highlighted").forEach(el => {
            let textContent = el.textContent;
            el.outerHTML = textContent;
        })
    }

    setColor(color){
        this.color = color;
    }
}

class Storage {
    constructor(){
        this.url = window.location.href;
        this.tempStorage = [];
        // this.local = [];
        this.storageState = this.initStorage();
    }

    initStorage(){
        try{
            if(!localStorage.getItem(this.url))
                localStorage.setItem(this.url, JSON.stringify([]));
            return true;
        }
        catch(err){
            console.log(err);
        }
    }

    #addToStorage(item){
        let savedItems = JSON.parse(localStorage.getItem(this.url));
        console.log(savedItems)
        savedItems.push(item);
        // console.log(savedItems)
        localStorage.setItem(this.url, JSON.stringify(savedItems));
    }
    

    save(selection){
        console.log("save")
        const path = new Path(selection);
        this.#addToStorage(path);
    }

    getAll(){
        return JSON.parse( localStorage.getItem(this.url) );
    }

    delete(id){

    }

    update(id){

    }
}
