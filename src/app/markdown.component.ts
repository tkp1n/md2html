import marked, { Renderer } from 'marked';
import highlightjs from 'highlight.js';
import DOMPurify from 'dompurify';

import { Component, Input, OnChanges, SimpleChange, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-markdown',
    template: '<div [innerHTML]="data"></div>',
    encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent implements OnChanges {
    @Input() text: string;
    data: SafeHtml;
    md: any;

    static highlightCode(code: string, language: string): string {
        if (!(language && highlightjs.getLanguage(language))) {
            language = 'markdown'; // use 'markdown' as default language
        }

        const highlighted = highlightjs.highlight(language, code).value;
        return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    }

    constructor(private sanitizer: DomSanitizer) {
        const renderer = new Renderer();
        renderer.code = MarkdownComponent.highlightCode;
        this.md = marked.setOptions({ renderer });
    }

    markdownToSafeHtml(value: string): SafeHtml {
        const html = this.md(value);
        const safeHtml = DOMPurify.sanitize(html);
        return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName === 'text') {
                const value = changes[propName].currentValue;
                if (value) {
                    this.data = this.markdownToSafeHtml(value);
                }
            }
        }
    }
}
