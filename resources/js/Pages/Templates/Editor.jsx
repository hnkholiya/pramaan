import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

let uid = 1;

/* ============================================================================ */
/*  Icons — inline SVGs, stroke-width 2, one consistent visual language for      */
/*  every control in the editor (library tiles, toolbar, properties panel).      */
/* ============================================================================ */

function TypeIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 6h14M12 6v12" />
        </svg>
    );
}

function BracesIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 4c-2 0-2 1.5-2 3.5S5 11 3 12c2 1 3 1 3 4.5S9 20 11 20" />
            <path d="M16 4c2 0 2 1.5 2 3.5S21 11 23 12c-2 1-3 1-3 4.5S13 20 11 20" transform="translate(0)" />
        </svg>
    );
}

function HashIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
        </svg>
    );
}

function LinkIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 15 15 9" />
            <path d="M11 6.5 12.5 5a3.5 3.5 0 1 1 5 5L16 11.5" />
            <path d="M13 17.5 11.5 19a3.5 3.5 0 1 1-5-5L8 12.5" />
        </svg>
    );
}

function QrCodeIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <path d="M14 14h3v3M20 14v3h-3M14 20h6" />
        </svg>
    );
}

function ImageIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m21 16-5-5-8 8" />
        </svg>
    );
}

function LayersIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 13 9 5 9-5" />
        </svg>
    );
}

function SlidersIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h10M18 6h2M4 18h2M10 18h10" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="8" cy="18" r="2" />
        </svg>
    );
}

function EyeIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function SaveIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 4h11l3 3v13H5z" />
            <path d="M8 4v6h8V4M8 21v-7h8v7" />
        </svg>
    );
}

function CheckIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
        </svg>
    );
}

function AlertIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 9v4M12 17h.01" />
            <path d="m10.3 3.9-8 14A1.5 1.5 0 0 0 3.6 20h16.8a1.5 1.5 0 0 0 1.3-2.2l-8-14a1.5 1.5 0 0 0-2.6 0Z" />
        </svg>
    );
}

function TrashIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
        </svg>
    );
}

function SpinnerIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function AlignLeftIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M4 12h10M4 18h13" />
        </svg>
    );
}

function AlignCenterIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M7 12h10M5.5 18h13" />
        </svg>
    );
}

function AlignRightIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M10 12h10M7 18h13" />
        </svg>
    );
}

/* Icon + accent lookup for each element type. Falls back to a generic layer   */
/* icon for any type the backend sends that isn't one of the known defaults.   */
const TYPE_ICON = {
    TEXT: TypeIcon,
    DYNAMIC_FIELD: BracesIcon,
    CERTIFICATE_NUMBER: HashIcon,
    VERIFICATION_URL: LinkIcon,
    QR_CODE: QrCodeIcon,
    IMAGE: ImageIcon,
};

function typeIconFor(type) {
    return TYPE_ICON[type] || LayersIcon;
}

export default function Editor({
    template,
    element_types,
    has_been_used,
}) {
    const [elements, setElements] = useState(
        (template.elements || []).map((element) => ({
            ...element,
            _id: element.id || `e${uid++}`,
        }))
    );

    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);

    // UI-only state: which panel shows on narrow screens, and a transient
    // save result so the person gets clear feedback without console output
    // being the only signal. Neither affects editor data or save behaviour.
    const [mobilePanel, setMobilePanel] = useState('elements');
    const [saveState, setSaveState] = useState(null); // null | 'success' | 'error'

    const canvasRef = useRef(null);
    const drag = useRef(null);
    const resize = useRef(null);

    const selected = elements.find(
        (element) => element._id === selectedId
    );

    const scale = 0.5;

    const canvasW = template.canvas_width * scale;
    const canvasH = template.canvas_height * scale;

    const addElement = (type) => {
        const defs = {
            TEXT: {
                name: 'Text',
                config: {
                    text: 'Your text',
                },
                styles: {
                    font_size: 24,
                    align: 'left',
                    color: '#000000',
                },
            },

            DYNAMIC_FIELD: {
                name: 'Dynamic Field',
                data_key: 'recipient_name',
                styles: {
                    font_size: 28,
                    align: 'center',
                    color: '#111827',
                },
            },

            CERTIFICATE_NUMBER: {
                name: 'Certificate Number',
                styles: {
                    font_size: 12,
                    align: 'left',
                    color: '#6b7280',
                },
            },

            VERIFICATION_URL: {
                name: 'Verification URL',
                styles: {
                    font_size: 10,
                    align: 'center',
                    color: '#2563eb',
                },
            },

            QR_CODE: {
                name: 'QR Code',
                styles: {
                    font_size: 10,
                },
                config: {
                    size: 120,
                },
            },

            IMAGE: {
                name: 'Image',
                styles: {},
            },
        };

        const definition = defs[type] || {
            name: type,
        };

        const newElement = {
            _id: `e${uid++}`,
            type,
            name: definition.name,
            data_key: definition.data_key || null,
            config: definition.config || {},
            position: {
                x: Math.round(
                    template.canvas_width / 2 - 150
                ),
                y: Math.round(
                    template.canvas_height / 2 - 20
                ),
            },
            size: {
                width: 300,
                height: 40,
            },
            styles: definition.styles || {},
            sort_order: elements.length,
        };

        setElements((previous) => [
            ...previous,
            newElement,
        ]);

        setSelectedId(newElement._id);
        setMobilePanel('properties');
    };

    const updateSelected = (patch) => {
        setElements((previous) =>
            previous.map((element) =>
                element._id === selectedId
                    ? {
                          ...element,
                          ...patch,
                      }
                    : element
            )
        );
    };

    const removeElement = () => {
        setElements((previous) =>
            previous.filter(
                (element) => element._id !== selectedId
            )
        );

        setSelectedId(null);
    };

    const saveLayout = () => {
        if (saving) {
            return;
        }

        const payload = elements.map(
            ({ _id, id, ...element }) => element
        );

        setSaving(true);
        setSaveState(null);

        router.post(
            route(
                'organization.templates.save-layout',
                template.id
            ),
            {
                elements: payload,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    console.log(
                        'Pramaan: template layout saved successfully.'
                    );
                    setSaveState('success');
                    setTimeout(() => setSaveState(null), 3000);
                },

                onError: (errors) => {
                    console.error(
                        'Pramaan: template layout save failed.',
                        errors
                    );
                    setSaveState('error');
                    setTimeout(() => setSaveState(null), 4000);
                },

                onFinish: () => {
                    setSaving(false);
                },
            }
        );
    };

    const startDrag = (event) => {
        if (!selected) {
            return;
        }

        drag.current = {
            startX: event.clientX,
            startY: event.clientY,
            origX: selected.position?.x ?? 0,
            origY: selected.position?.y ?? 0,
        };

        event.preventDefault();
    };

    const onMove = (event) => {
        if (!drag.current || !selected) {
            return;
        }

        const dx =
            (event.clientX - drag.current.startX) / scale;

        const dy =
            (event.clientY - drag.current.startY) / scale;

        updateSelected({
            position: {
                x: Math.max(
                    0,
                    Math.round(
                        drag.current.origX + dx
                    )
                ),

                y: Math.max(
                    0,
                    Math.round(
                        drag.current.origY + dy
                    )
                ),
            },
        });
    };

    const endDrag = () => {
        drag.current = null;
    };

    /* ------------------------------------------------------------------ */
    /*  Resize — mouse-only. Each of the 8 handles reports which edges it   */
    /*  affects (e.g. 'se' affects the east and south edges). Width/height  */
    /*  are only ever changed by dragging these handles; there is no        */
    /*  numeric width/height input anywhere in the UI.                      */
    /* ------------------------------------------------------------------ */

    const MIN_WIDTH = 20;
    const MIN_HEIGHT = 12;
    const MIN_FONT_SIZE = 6;

    const startResize = (event, handle) => {
        if (!selected) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        resize.current = {
            handle,
            startX: event.clientX,
            startY: event.clientY,
            origX: selected.position?.x ?? 0,
            origY: selected.position?.y ?? 0,
            origWidth: selected.size?.width ?? 0,
            origHeight: selected.size?.height ?? 0,
            origFontSize: selected.styles?.font_size ?? 14,
        };
    };

    const onResize = (event) => {
        if (!resize.current || !selected) {
            return;
        }

        const r = resize.current;

        const dx = (event.clientX - r.startX) / scale;
        const dy = (event.clientY - r.startY) / scale;

        const affectsEast = r.handle.includes('e');
        const affectsWest = r.handle.includes('w');
        const affectsSouth = r.handle.includes('s');
        const affectsNorth = r.handle.includes('n');

        let newX = r.origX;
        let newY = r.origY;
        let newWidth = r.origWidth;
        let newHeight = r.origHeight;

        if (affectsEast) {
            newWidth = Math.max(MIN_WIDTH, r.origWidth + dx);
        }

        if (affectsWest) {
            newWidth = Math.max(MIN_WIDTH, r.origWidth - dx);
            newX = r.origX + (r.origWidth - newWidth);
        }

        if (affectsSouth) {
            newHeight = Math.max(MIN_HEIGHT, r.origHeight + dy);
        }

        if (affectsNorth) {
            newHeight = Math.max(MIN_HEIGHT, r.origHeight - dy);
            newY = r.origY + (r.origHeight - newHeight);
        }

        // Auto font scaling: the font size scales proportionally to the
        // resize. A corner handle (touches both an x and a y edge) scales
        // by the combined (geometric-mean) change in both dimensions; an
        // edge handle scales by whichever single dimension it controls.
        const widthRatio = r.origWidth > 0 ? newWidth / r.origWidth : 1;
        const heightRatio = r.origHeight > 0 ? newHeight / r.origHeight : 1;

        const affectsWidth = affectsEast || affectsWest;
        const affectsHeight = affectsNorth || affectsSouth;

        let fontRatio = 1;
        if (affectsWidth && affectsHeight) {
            fontRatio = Math.sqrt(widthRatio * heightRatio);
        } else if (affectsWidth) {
            fontRatio = widthRatio;
        } else if (affectsHeight) {
            fontRatio = heightRatio;
        }

        const newFontSize = Math.max(
            MIN_FONT_SIZE,
            Math.round(r.origFontSize * fontRatio)
        );

        updateSelected({
            position: {
                x: Math.max(0, Math.round(newX)),
                y: Math.max(0, Math.round(newY)),
            },
            size: {
                width: Math.round(newWidth),
                height: Math.round(newHeight),
            },
            styles: {
                ...selected.styles,
                font_size: newFontSize,
            },
        });
    };

    const endResize = () => {
        resize.current = null;
    };

    // A single pointer-move/up/leave handler drives both moving (drag) and
    // resizing (resize) — whichever ref is currently active — so the
    // existing onMove/endDrag logic above stays untouched.
    const handleCanvasPointerMove = (event) => {
        onMove(event);
        onResize(event);
    };

    const handleCanvasPointerEnd = () => {
        endDrag();
        endResize();
    };

    /* ------------------------------------------------------------------ */
    /*  Keyboard delete — Delete/Backspace removes the selected element    */
    /*  instantly, unless focus is inside a text input/textarea/select     */
    /*  (so typing a name, data key, or text content still works normally, */
    /*  including using Backspace to edit that text).                      */
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!selectedId) {
                return;
            }

            const active = document.activeElement;
            const tag = active?.tagName;
            const isEditableField =
                tag === 'INPUT' ||
                tag === 'TEXTAREA' ||
                tag === 'SELECT' ||
                active?.isContentEditable;

            if (isEditableField) {
                return;
            }

            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                removeElement();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center gap-3">
                    <img src="/pramaan.svg" alt="" className="h-6 w-6 object-contain" />
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            Template Editor
                        </p>
                        <h2 className="text-xl font-semibold text-gray-800 truncate">
                            {template.name}
                        </h2>
                    </div>
                    {has_been_used && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            <AlertIcon className="h-3 w-3" />
                            Versioned on save
                        </span>
                    )}
                </div>
            }
        >
            <div
                className="min-h-[calc(100vh-4rem)] bg-slate-50/60"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                        {/* ==================================================== */}
                        {/*  ELEMENT LIBRARY — left panel                        */}
                        {/* ==================================================== */}
                        <aside
                            className={`order-2 w-full shrink-0 lg:order-1 lg:block lg:w-64 ${
                                mobilePanel === 'elements' ? 'block' : 'hidden'
                            }`}
                        >
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                                        <LayersIcon className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                        Add Element
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-2 p-4 lg:grid-cols-1">
                                    {element_types.map((type) => {
                                        const Icon = typeIconFor(type.value);
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => addElement(type.value)}
                                                className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="truncate">{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {has_been_used && (
                                    <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                                        <AlertIcon className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                                        <p className="text-[11px] leading-relaxed text-amber-800">
                                            Template already used — saving creates a new version.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* ==================================================== */}
                        {/*  CANVAS — centre workspace                           */}
                        {/* ==================================================== */}
                        <div className="order-1 min-w-0 flex-1 lg:order-2">
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                {/* Canvas toolbar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="hidden sm:inline">Select · drag to move · drag a handle to resize · Delete to remove</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">
                                            {Math.round(scale * 100)}% preview
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {saveState === 'success' && (
                                            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
                                                <CheckIcon className="h-3.5 w-3.5" />
                                                Saved
                                            </span>
                                        )}
                                        {saveState === 'error' && (
                                            <span className="hidden items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 sm:inline-flex">
                                                <AlertIcon className="h-3.5 w-3.5" />
                                                Save failed
                                            </span>
                                        )}

                                        <a
                                            href={route(
                                                'organization.templates.preview',
                                                template.id
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            Preview
                                        </a>

                                        <button
                                            type="button"
                                            onClick={saveLayout}
                                            disabled={saving}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <SpinnerIcon className="h-4 w-4" />
                                                    Saving…
                                                </>
                                            ) : (
                                                <>
                                                    <SaveIcon className="h-4 w-4" />
                                                    Save Layout
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Canvas surface */}
                                <div className="overflow-auto rounded-b-2xl bg-slate-100/80 p-4 sm:p-6">
                                    <div
                                        ref={canvasRef}
                                        onMouseMove={handleCanvasPointerMove}
                                        onMouseUp={handleCanvasPointerEnd}
                                        onMouseLeave={handleCanvasPointerEnd}
                                        className="relative mx-auto overflow-hidden bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-200"
                                        style={{
                                            width: canvasW,
                                            height: canvasH,
                                        }}
                                    >
                                        {/* Uploaded template background */}
                                        {template.asset &&
                                            template.asset.type === 'image' && (
                                                <img
                                                    src={route(
                                                        'organization.templates.asset',
                                                        template.id
                                                    )}
                                                    alt={
                                                        template.asset
                                                            .original_name
                                                    }
                                                    className="absolute inset-0 h-full w-full select-none object-fill pointer-events-none"
                                                    draggable="false"
                                                />
                                            )}

                                        {/* Template elements — single positioned div per element,     */}
                                        {/* identical left/top/width/height math to before. The         */}
                                        {/* selection name-tag is a child of this same div, so it        */}
                                        {/* inherits this element's position as its own containing       */}
                                        {/* block and never shifts the element itself.                   */}
                                        {elements.map((element) => {
                                            const isSelected =
                                                element._id === selectedId;

                                            return (
                                                <div
                                                    key={element._id}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setSelectedId(element._id);
                                                        setMobilePanel('properties');
                                                    }}
                                                    onMouseDown={(event) => {
                                                        event.stopPropagation();
                                                        setSelectedId(element._id);
                                                        setMobilePanel('properties');
                                                        startDrag(event);
                                                    }}
                                                    className="absolute flex cursor-move items-center justify-center transition-colors"
                                                    style={{
                                                        left: (element.position?.x ?? 0) * scale,
                                                        top: (element.position?.y ?? 0) * scale,
                                                        width: (element.size?.width ?? 0) * scale,
                                                        height: (element.size?.height ?? 0) * scale,
                                                        fontSize: (element.styles?.font_size || 14) * scale,
                                                        color: element.styles?.color || '#000',
                                                        textAlign: element.styles?.align || 'left',
                                                        border: isSelected
                                                            ? '2px dashed #6366f1'
                                                            : '1px dashed transparent',
                                                        outline: isSelected ? '4px solid rgba(99,102,241,0.08)' : 'none',
                                                        overflow: 'hidden',
                                                        zIndex: isSelected ? 20 : 10,
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <>
                                                            <span
                                                                className="absolute -top-6 left-0 whitespace-nowrap rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm"
                                                                style={{ fontSize: 10, textAlign: 'left' }}
                                                            >
                                                                {element.name || element.type}
                                                            </span>

                                                            {/* Resize handles — the only way to change width/     */}
                                                            {/* height. Each reports which edge(s) it controls to  */}
                                                            {/* onResize via startResize(event, handle).           */}
                                                            {[
                                                                { handle: 'nw', cursor: 'nwse-resize', style: { top: -5, left: -5 } },
                                                                { handle: 'n', cursor: 'ns-resize', style: { top: -5, left: '50%', marginLeft: -5 } },
                                                                { handle: 'ne', cursor: 'nesw-resize', style: { top: -5, right: -5 } },
                                                                { handle: 'e', cursor: 'ew-resize', style: { top: '50%', right: -5, marginTop: -5 } },
                                                                { handle: 'se', cursor: 'nwse-resize', style: { bottom: -5, right: -5 } },
                                                                { handle: 's', cursor: 'ns-resize', style: { bottom: -5, left: '50%', marginLeft: -5 } },
                                                                { handle: 'sw', cursor: 'nesw-resize', style: { bottom: -5, left: -5 } },
                                                                { handle: 'w', cursor: 'ew-resize', style: { top: '50%', left: -5, marginTop: -5 } },
                                                            ].map(({ handle, cursor, style }) => (
                                                                <span
                                                                    key={handle}
                                                                    onMouseDown={(event) => startResize(event, handle)}
                                                                    className="absolute h-2.5 w-2.5 rounded-full border-2 border-indigo-600 bg-white shadow-sm hover:scale-125 transition-transform"
                                                                    style={{ ...style, cursor, zIndex: 30 }}
                                                                />
                                                            ))}
                                                        </>
                                                    )}

                                                    {element.type === 'QR_CODE' ? (
                                                        <span className="inline-flex items-center gap-1 text-current">
                                                            <QrCodeIcon className="h-[1em] w-[1em]" />
                                                            QR
                                                        </span>
                                                    ) : element.type === 'IMAGE' ? (
                                                        <span className="inline-flex items-center gap-1 text-current">
                                                            <ImageIcon className="h-[1em] w-[1em]" />
                                                        </span>
                                                    ) : (
                                                        label(element)
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile panel switcher — desktop keeps both panels visible */}
                            <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobilePanel('elements')}
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                                        mobilePanel === 'elements'
                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <LayersIcon className="h-4 w-4" />
                                    Elements
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobilePanel('properties')}
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                                        mobilePanel === 'properties'
                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <SlidersIcon className="h-4 w-4" />
                                    Properties
                                </button>
                            </div>
                        </div>

                        {/* ==================================================== */}
                        {/*  PROPERTIES — right panel                            */}
                        {/* ==================================================== */}
                        <aside
                            className={`order-3 w-full shrink-0 lg:block lg:w-72 ${
                                mobilePanel === 'properties' ? 'block' : 'hidden'
                            }`}
                        >
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-20">
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                                            <SlidersIcon className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                            Properties
                                        </h3>
                                    </div>

                                    {selected && (
                                        <button
                                            type="button"
                                            onClick={removeElement}
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                        >
                                            <TrashIcon className="h-3.5 w-3.5" />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {!selected ? (
                                    <div className="px-5 py-10 text-center">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300 mb-3">
                                            <SlidersIcon className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Select an element on the canvas to edit its properties.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-5 p-4">
                                        {/* General */}
                                        <div>
                                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                General
                                            </p>
                                            <label className="block">
                                                <span className="text-xs text-slate-500">Name</span>
                                                <input
                                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                    value={selected.name || ''}
                                                    onChange={(event) =>
                                                        updateSelected({ name: event.target.value })
                                                    }
                                                />
                                            </label>
                                        </div>

                                        {/* Content */}
                                        {(selected.type === 'DYNAMIC_FIELD' || selected.type === 'TEXT') && (
                                            <div>
                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Content
                                                </p>

                                                {selected.type === 'DYNAMIC_FIELD' && (
                                                    <label className="block">
                                                        <span className="text-xs text-slate-500">Data Key (CSV field)</span>
                                                        <input
                                                            className="mt-1 w-full rounded-lg border-slate-300 font-mono text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                            value={selected.data_key || ''}
                                                            onChange={(event) =>
                                                                updateSelected({ data_key: event.target.value })
                                                            }
                                                        />
                                                    </label>
                                                )}

                                                {selected.type === 'TEXT' && (
                                                    <label className="block">
                                                        <span className="text-xs text-slate-500">Text</span>
                                                        <textarea
                                                            rows={3}
                                                            className="mt-1 w-full rounded-lg border-slate-300 text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                            value={selected.config?.text || ''}
                                                            onChange={(event) =>
                                                                updateSelected({
                                                                    config: {
                                                                        ...selected.config,
                                                                        text: event.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        )}

                                        {/* Position & size — X/Y stay as precise numeric fields;      */}
                                        {/* width/height are mouse-only now, so they're shown as a      */}
                                        {/* live read-out (updated by dragging the canvas handles),     */}
                                        {/* not editable inputs.                                        */}
                                        <div>
                                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Position &amp; Size
                                            </p>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <label className="block">
                                                    <span className="text-xs text-slate-500">X</span>
                                                    <input
                                                        type="number"
                                                        className="mt-1 w-full rounded-lg border-slate-300 text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                        value={selected.position?.x ?? 0}
                                                        onChange={(event) =>
                                                            updateSelected({
                                                                position: {
                                                                    ...selected.position,
                                                                    x: Number(event.target.value),
                                                                },
                                                            })
                                                        }
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="text-xs text-slate-500">Y</span>
                                                    <input
                                                        type="number"
                                                        className="mt-1 w-full rounded-lg border-slate-300 text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                        value={selected.position?.y ?? 0}
                                                        onChange={(event) =>
                                                            updateSelected({
                                                                position: {
                                                                    ...selected.position,
                                                                    y: Number(event.target.value),
                                                                },
                                                            })
                                                        }
                                                    />
                                                </label>

                                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                                    <span className="block text-[10px] text-slate-400">Width</span>
                                                    <span className="block text-sm font-semibold text-slate-700">
                                                        {Math.round(selected.size?.width ?? 0)}px
                                                    </span>
                                                </div>

                                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                                    <span className="block text-[10px] text-slate-400">Height</span>
                                                    <span className="block text-sm font-semibold text-slate-700">
                                                        {Math.round(selected.size?.height ?? 0)}px
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                                                Drag a handle on the selected element to resize it. Font size scales automatically.
                                            </p>
                                        </div>

                                        {/* Typography */}
                                        <div>
                                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Typography
                                            </p>
                                            <div className="space-y-3">
                                                <label className="block">
                                                    <span className="text-xs text-slate-500">Font Size</span>
                                                    <input
                                                        type="number"
                                                        className="mt-1 w-full rounded-lg border-slate-300 text-sm shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                        value={selected.styles?.font_size ?? 14}
                                                        onChange={(event) =>
                                                            updateSelected({
                                                                styles: {
                                                                    ...selected.styles,
                                                                    font_size: Number(event.target.value),
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="mt-1 block text-[11px] text-slate-400">
                                                        Scales automatically when you resize the element on the canvas.
                                                    </span>
                                                </label>

                                                <div>
                                                    <span className="text-xs text-slate-500">Color</span>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-slate-300 p-0.5"
                                                            value={selected.styles?.color || '#000000'}
                                                            onChange={(event) =>
                                                                updateSelected({
                                                                    styles: {
                                                                        ...selected.styles,
                                                                        color: event.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-lg border-slate-300 font-mono text-xs shadow-2xs focus:border-indigo-500 focus:ring-indigo-500"
                                                            value={selected.styles?.color || '#000000'}
                                                            onChange={(event) =>
                                                                updateSelected({
                                                                    styles: {
                                                                        ...selected.styles,
                                                                        color: event.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-xs text-slate-500">Align</span>
                                                    <div className="mt-1 grid grid-cols-3 gap-1.5">
                                                        {[
                                                            { value: 'left', Icon: AlignLeftIcon },
                                                            { value: 'center', Icon: AlignCenterIcon },
                                                            { value: 'right', Icon: AlignRightIcon },
                                                        ].map(({ value, Icon }) => {
                                                            const active = (selected.styles?.align || 'left') === value;
                                                            return (
                                                                <button
                                                                    key={value}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateSelected({
                                                                            styles: {
                                                                                ...selected.styles,
                                                                                align: value,
                                                                            },
                                                                        })
                                                                    }
                                                                    aria-pressed={active}
                                                                    className={`flex items-center justify-center rounded-lg border py-2 transition-colors ${
                                                                        active
                                                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <Icon className="h-4 w-4" />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );

    function label(element) {
        if (element.type === 'DYNAMIC_FIELD') {
            return `{{ ${element.data_key || element.name} }}`;
        }

        if (element.type === 'CERTIFICATE_NUMBER') {
            return 'PRM-0000-0000000000';
        }

        if (element.type === 'VERIFICATION_URL') {
            return 'https://…/verify/…';
        }

        if (element.type === 'TEXT') {
            return element.config?.text || element.name;
        }

        return element.name;
    }
}