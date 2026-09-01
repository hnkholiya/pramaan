import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

let uid = 1;

export default function Editor({
    template,
    element_types = [],
    has_been_used,
}) {
    const [elements, setElements] = useState(
        (template.elements || []).map((element) => ({
            ...element,
            _id: `existing-${element.id ?? uid++}`,
        }))
    );

    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);

    const canvasRef = useRef(null);
    const drag = useRef(null);

    const selected = elements.find(
        (element) => element._id === selectedId
    );

    const scale = 0.5;

    const canvasW = template.canvas_width * scale;
    const canvasH = template.canvas_height * scale;

    const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

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
                size: {
                    width: 300,
                    height: 40,
                },
            },

            DYNAMIC_FIELD: {
                name: 'Dynamic Field',
                data_key: 'recipient_name',
                config: {},
                styles: {
                    font_size: 28,
                    align: 'center',
                    color: '#111827',
                },
                size: {
                    width: 300,
                    height: 40,
                },
            },

            CERTIFICATE_NUMBER: {
                name: 'Certificate Number',
                config: {},
                styles: {
                    font_size: 12,
                    align: 'left',
                    color: '#6b7280',
                },
                size: {
                    width: 300,
                    height: 30,
                },
            },

            VERIFICATION_URL: {
                name: 'Verification URL',
                config: {},
                styles: {
                    font_size: 10,
                    align: 'center',
                    color: '#2563eb',
                },
                size: {
                    width: 400,
                    height: 30,
                },
            },

            QR_CODE: {
                name: 'QR Code',
                config: {
                    size: 120,
                },
                styles: {},
                size: {
                    width: 120,
                    height: 120,
                },
            },

            IMAGE: {
                name: 'Image',
                config: {},
                styles: {},
                size: {
                    width: 220,
                    height: 140,
                },
            },

            RECTANGLE: {
                name: 'Rectangle',
                config: {
                    fill: 'transparent',
                    border_color: '#D4AF37',
                    border_width: 3,
                    radius: 8,
                },
                styles: {},
                size: {
                    width: 500,
                    height: 250,
                },
            },

            LINE: {
                name: 'Line',
                config: {
                    orientation: 'horizontal',
                    color: '#D4AF37',
                    thickness: 3,
                },
                styles: {},
                size: {
                    width: 500,
                    height: 3,
                },
            },

            BACKGROUND: {
                name: 'Background',
                config: {
                    color: '#FFFFFF',
                },
                styles: {},
                size: {
                    width: template.canvas_width,
                    height: template.canvas_height,
                },
            },

            DECORATION: {
                name: 'Decoration',
                config: {
                    variant: 'corner',
                    color: '#D4AF37',
                    secondary_color: null,
                },
                styles: {},
                size: {
                    width: 100,
                    height: 100,
                },
            },
        };

        const definition = defs[type] || {
            name: type,
            config: {},
            styles: {},
            size: {
                width: 300,
                height: 40,
            },
        };

        const defaultWidth =
            definition.size?.width ?? 300;

        const defaultHeight =
            definition.size?.height ?? 40;

        const maxX =
            Math.max(
                0,
                template.canvas_width - defaultWidth
            );

        const maxY =
            Math.max(
                0,
                template.canvas_height - defaultHeight
            );

        let defaultX = Math.round(
            template.canvas_width / 2 -
                defaultWidth / 2
        );

        let defaultY = Math.round(
            template.canvas_height / 2 -
                defaultHeight / 2
        );

        if (type === 'BACKGROUND') {
            defaultX = 0;
            defaultY = 0;
        }

        const newElement = {
            _id: `e${uid++}`,

            type,

            name: definition.name,

            data_key:
                definition.data_key || null,

            config:
                definition.config || {},

            position: {
                x: clamp(defaultX, 0, maxX),
                y: clamp(defaultY, 0, maxY),
            },

            size: {
                width: defaultWidth,
                height: defaultHeight,
            },

            styles:
                definition.styles || {},

            sort_order: elements.length,
        };

        setElements((previous) => [
            ...previous,
            newElement,
        ]);

        setSelectedId(newElement._id);
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

    const updateSelectedConfig = (patch) => {
        if (!selected) {
            return;
        }

        updateSelected({
            config: {
                ...(selected.config || {}),
                ...patch,
            },
        });
    };

    const updateSelectedStyles = (patch) => {
        if (!selected) {
            return;
        }

        updateSelected({
            styles: {
                ...(selected.styles || {}),
                ...patch,
            },
        });
    };

    const removeElement = () => {
        if (!selected) {
            return;
        }

        setElements((previous) =>
            previous
                .filter(
                    (element) =>
                        element._id !== selectedId
                )
                .map((element, index) => ({
                    ...element,
                    sort_order: index,
                }))
        );

        setSelectedId(null);
    };

    const bringForward = () => {
        if (!selected) {
            return;
        }

        setElements((previous) => {
            const ordered = [...previous]
                .sort(
                    (a, b) =>
                        (a.sort_order ?? 0) -
                        (b.sort_order ?? 0)
                );

            const index = ordered.findIndex(
                (element) =>
                    element._id === selectedId
            );

            if (
                index === -1 ||
                index === ordered.length - 1
            ) {
                return previous;
            }

            const current = ordered[index];
            const next = ordered[index + 1];

            ordered[index] = next;
            ordered[index + 1] = current;

            return ordered.map(
                (element, newIndex) => ({
                    ...element,
                    sort_order: newIndex,
                })
            );
        });
    };

    const sendBackward = () => {
        if (!selected) {
            return;
        }

        setElements((previous) => {
            const ordered = [...previous]
                .sort(
                    (a, b) =>
                        (a.sort_order ?? 0) -
                        (b.sort_order ?? 0)
                );

            const index = ordered.findIndex(
                (element) =>
                    element._id === selectedId
            );

            if (index <= 0) {
                return previous;
            }

            const current = ordered[index];
            const previousElement =
                ordered[index - 1];

            ordered[index] = previousElement;
            ordered[index - 1] = current;

            return ordered.map(
                (element, newIndex) => ({
                    ...element,
                    sort_order: newIndex,
                })
            );
        });
    };

    const saveLayout = () => {
        if (saving) {
            return;
        }

        const payload = [...elements]
            .sort(
                (a, b) =>
                    (a.sort_order ?? 0) -
                    (b.sort_order ?? 0)
            )
            .map(
                ({
                    _id,
                    id,
                    ...element
                }, index) => ({
                    ...element,
                    sort_order: index,
                })
            );

        setSaving(true);

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
                },

                onError: (errors) => {
                    console.error(
                        'Pramaan: template layout save failed.',
                        errors
                    );
                },

                onFinish: () => {
                    setSaving(false);
                },
            }
        );
    };

    const startDrag = (event, element = selected) => {
        if (!element) {
            return;
        }

        if (
            element.type === 'BACKGROUND'
        ) {
            return;
        }

        drag.current = {
            startX: event.clientX,
            startY: event.clientY,

            origX:
                element.position?.x ?? 0,

            origY:
                element.position?.y ?? 0,

            elementId: element._id,
        };

        event.preventDefault();
    };

    const onMove = (event) => {
        if (
            !drag.current ||
            !selected
        ) {
            return;
        }

        if (
            drag.current.elementId !==
            selected._id
        ) {
            return;
        }

        const dx =
            (event.clientX -
                drag.current.startX) /
            scale;

        const dy =
            (event.clientY -
                drag.current.startY) /
            scale;

        const elementWidth =
            selected.size?.width ?? 0;

        const elementHeight =
            selected.size?.height ?? 0;

        const maxX = Math.max(
            0,
            template.canvas_width -
                elementWidth
        );

        const maxY = Math.max(
            0,
            template.canvas_height -
                elementHeight
        );

        updateSelected({
            position: {
                x: clamp(
                    Math.round(
                        drag.current.origX +
                            dx
                    ),
                    0,
                    maxX
                ),

                y: clamp(
                    Math.round(
                        drag.current.origY +
                            dy
                    ),
                    0,
                    maxY
                ),
            },
        });
    };

    const endDrag = () => {
        drag.current = null;
    };

    const elementStyle = (element) => {
        const config =
            element.config || {};

        const styles =
            element.styles || {};

        const isBackground =
            element.type ===
            'BACKGROUND';

        const isSelected =
            element._id === selectedId;

        const base = {
            position: 'absolute',

            left:
                (element.position?.x ?? 0) *
                scale,

            top:
                (element.position?.y ?? 0) *
                scale,

            width:
                (element.size?.width ?? 0) *
                scale,

            height:
                (element.size?.height ?? 0) *
                scale,

            zIndex: isBackground
                ? -10
                : (element.sort_order ?? 0) +
                  20,

            overflow: 'hidden',

            pointerEvents:
                isBackground
                    ? 'none'
                    : 'auto',
        };

        if (
            element.type ===
            'RECTANGLE'
        ) {
            return {
                ...base,

                backgroundColor:
                    config.fill ===
                    'transparent'
                        ? 'transparent'
                        : config.fill ||
                          'transparent',

                border:
                    `${Math.max(
                        0,
                        Number(
                            config.border_width ||
                                0
                        )
                    ) * scale}px solid ${
                        config.border_color ||
                        '#000000'
                    }`,

                borderRadius:
                    `${Math.max(
                        0,
                        Number(
                            config.radius || 0
                        )
                    ) * scale}px`,
            };
        }

        if (
            element.type === 'LINE'
        ) {
            const thickness =
                Math.max(
                    1,
                    Number(
                        config.thickness || 2
                    )
                ) * scale;

            return {
                ...base,

                backgroundColor:
                    config.color ||
                    '#000000',

                width:
                    config.orientation ===
                    'vertical'
                        ? thickness
                        : base.width,

                height:
                    config.orientation ===
                    'vertical'
                        ? base.height
                        : thickness,
            };
        }

        if (
            element.type ===
            'BACKGROUND'
        ) {
            return {
                ...base,

                backgroundColor:
                    config.color ||
                    '#FFFFFF',
            };
        }

        if (
            element.type ===
            'DECORATION'
        ) {
            return {
                ...base,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                color:
                    config.color ||
                    '#D4AF37',

                opacity:
                    styles.opacity ??
                    1,
            };
        }

        return {
            ...base,

            display: 'flex',
            alignItems: 'center',

            justifyContent:
                styles.align === 'right'
                    ? 'flex-end'
                    : styles.align ===
                        'center'
                      ? 'center'
                      : 'flex-start',

            fontSize:
                Math.max(
                    8,
                    Number(
                        styles.font_size ||
                            14
                    ) * scale
                ),

            fontFamily:
                styles.font_family ||
                'inherit',

            fontWeight:
                styles.bold
                    ? '700'
                    : '400',

            fontStyle:
                styles.italic
                    ? 'italic'
                    : 'normal',

            color:
                styles.color ||
                '#000000',

            textAlign:
                styles.align ||
                'left',

            opacity:
                styles.opacity ??
                1,

            border:
                isSelected
                    ? '2px dashed #6366F1'
                    : '1px solid transparent',
        };
    };

    const renderDecoration = (
        element
    ) => {
        const config =
            element.config || {};

        const color =
            config.color ||
            '#D4AF37';

        const secondaryColor =
            config.secondary_color ||
            color;

        const common = {
            color,
        };

        switch (
            config.variant
        ) {
            case 'double_corner':
                return (
                    <div
                        className="relative h-full w-full"
                        style={common}
                    >
                        <div
                            className="absolute left-0 top-0 h-1/2 w-1/2"
                            style={{
                                borderLeft: `3px solid ${color}`,
                                borderTop: `3px solid ${color}`,
                            }}
                        />

                        <div
                            className="absolute left-2 top-2 h-[40%] w-[40%]"
                            style={{
                                borderLeft: `1px solid ${secondaryColor}`,
                                borderTop: `1px solid ${secondaryColor}`,
                            }}
                        />
                    </div>
                );

            case 'seal':
                return (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                            color,
                        }}
                    >
                        <div
                            className="flex h-[80%] w-[80%] items-center justify-center rounded-full border-2"
                            style={{
                                borderColor:
                                    color,
                            }}
                        >
                            <div
                                className="flex h-[65%] w-[65%] items-center justify-center rounded-full border"
                                style={{
                                    borderColor:
                                        secondaryColor,
                                    fontSize:
                                        '0.55em',
                                    fontWeight:
                                        700,
                                }}
                            >
                                SEAL
                            </div>
                        </div>
                    </div>
                );

            case 'divider':
                return (
                    <div className="flex h-full w-full items-center justify-center">
                        <div
                            className="h-px w-[80%]"
                            style={{
                                backgroundColor:
                                    color,
                            }}
                        />

                        <div
                            className="absolute h-2 w-2 rotate-45"
                            style={{
                                backgroundColor:
                                    secondaryColor,
                            }}
                        />
                    </div>
                );

            case 'ornament':
                return (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                            color,
                        }}
                    >
                        <div
                            className="h-[65%] w-[65%] rotate-45 border-2"
                            style={{
                                borderColor:
                                    color,
                            }}
                        >
                            <div
                                className="h-full w-full border"
                                style={{
                                    borderColor:
                                        secondaryColor,
                                }}
                            />
                        </div>
                    </div>
                );

            case 'corner':
            default:
                return (
                    <div className="relative h-full w-full">
                        <div
                            className="absolute left-0 top-0 h-full w-full"
                            style={{
                                borderLeft: `4px solid ${color}`,
                                borderTop: `4px solid ${color}`,
                            }}
                        />

                        <div
                            className="absolute left-3 top-3 h-[60%] w-[60%]"
                            style={{
                                borderLeft: `1px solid ${secondaryColor}`,
                                borderTop: `1px solid ${secondaryColor}`,
                            }}
                        />
                    </div>
                );
        }
    };

    const renderCanvasElement = (
        element
    ) => {
        const config =
            element.config || {};

        if (
            element.type ===
            'BACKGROUND'
        ) {
            return null;
        }

        if (
            element.type ===
            'RECTANGLE'
        ) {
            return null;
        }

        if (
            element.type ===
            'LINE'
        ) {
            return null;
        }

        if (
            element.type ===
            'DECORATION'
        ) {
            return renderDecoration(
                element
            );
        }

        if (
            element.type ===
            'QR_CODE'
        ) {
            return (
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-[70%] w-[70%] items-center justify-center border-4 border-slate-800 font-bold text-slate-500">
                        QR
                    </div>
                </div>
            );
        }

        if (
            element.type ===
            'IMAGE'
        ) {
            return (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl text-slate-400">
                    🖼
                </div>
            );
        }

        return (
            <>
                {element.type ===
                    'TEXT' &&
                    (
                        element.config
                            ?.text ||
                        element.name
                    )}

                {element.type ===
                    'DYNAMIC_FIELD' && (
                    <span className="font-semibold">
                        {`{{ ${
                            element.data_key ||
                            element.name
                        } }}`}
                    </span>
                )}

                {element.type ===
                    'CERTIFICATE_NUMBER' && (
                    <span>
                        PRM-0000-0000000000
                    </span>
                )}

                {element.type ===
                    'VERIFICATION_URL' && (
                    <span>
                        https://.../verify/...
                    </span>
                )}
            </>
        );
    };

    const selectedConfig =
        selected?.config || {};

    const selectedStyles =
        selected?.styles || {};

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Template Editor —{' '}
                    {template.name}
                </h2>
            }
        >
            <div className="py-6">
                <div className="mx-auto flex max-w-[1500px] gap-4 px-4">

                    {/* Toolbar */}
                    <div className="w-64 shrink-0 rounded-xl bg-white p-4 shadow">
                        <h3 className="mb-3 text-sm font-semibold text-slate-700">
                            Add Element
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                            {element_types.map(
                                (type) => (
                                    <button
                                        key={
                                            type.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            addElement(
                                                type.value
                                            )
                                        }
                                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                                            [
                                                'RECTANGLE',
                                                'LINE',
                                                'BACKGROUND',
                                                'DECORATION',
                                            ].includes(
                                                type.value
                                            )
                                                ? 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400 hover:bg-amber-100'
                                                : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {
                                            type.label
                                        }
                                    </button>
                                )
                            )}
                        </div>

                        {has_been_used && (
                            <p className="mt-4 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                                Template already
                                used — saving creates
                                a new version.
                            </p>
                        )}

                        {selected && (
                            <div className="mt-4 border-t border-slate-100 pt-4">

                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-700">
                                        Properties
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={
                                            removeElement
                                        }
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="mt-3 space-y-3">

                                    {/* Name */}
                                    <label className="block">
                                        <span className="text-xs text-slate-500">
                                            Name
                                        </span>

                                        <input
                                            className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                            value={
                                                selected.name ||
                                                ''
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSelected(
                                                    {
                                                        name: event
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                        />
                                    </label>

                                    {/* Dynamic field */}
                                    {selected.type ===
                                        'DYNAMIC_FIELD' && (
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Data Key
                                            </span>

                                            <input
                                                className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                value={
                                                    selected.data_key ||
                                                    ''
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSelected(
                                                        {
                                                            data_key:
                                                                event
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </label>
                                    )}

                                    {/* Text */}
                                    {selected.type ===
                                        'TEXT' && (
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Text
                                            </span>

                                            <textarea
                                                className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                rows={3}
                                                value={
                                                    selected
                                                        .config
                                                        ?.text ||
                                                    ''
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSelectedConfig(
                                                        {
                                                            text: event
                                                                .target
                                                                .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </label>
                                    )}

                                    {/* Rectangle */}
                                    {selected.type ===
                                        'RECTANGLE' && (
                                        <>
                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Fill
                                                    Color
                                                </span>

                                                <div className="mt-1 flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={
                                                            selectedConfig
                                                                .fill !==
                                                            'transparent'
                                                                ? selectedConfig.fill ||
                                                                  '#FFFFFF'
                                                                : '#FFFFFF'
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateSelectedConfig(
                                                                {
                                                                    fill:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                        className="h-9 w-12 rounded border border-slate-300"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateSelectedConfig(
                                                                {
                                                                    fill: 'transparent',
                                                                }
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-300 px-2 text-xs text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Transparent
                                                    </button>
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Border
                                                    Color
                                                </span>

                                                <input
                                                    type="color"
                                                    value={
                                                        selectedConfig
                                                            .border_color ||
                                                        '#D4AF37'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                border_color:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 h-9 w-full rounded border border-slate-300"
                                                />
                                            </label>

                                            <div className="grid grid-cols-2 gap-2">
                                                <label className="block">
                                                    <span className="text-xs text-slate-500">
                                                        Border
                                                        Width
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                        value={
                                                            selectedConfig.border_width ??
                                                            3
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateSelectedConfig(
                                                                {
                                                                    border_width:
                                                                        clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            0,
                                                                            20
                                                                        ),
                                                                }
                                                            )
                                                        }
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="text-xs text-slate-500">
                                                        Radius
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                        value={
                                                            selectedConfig.radius ??
                                                            8
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateSelectedConfig(
                                                                {
                                                                    radius:
                                                                        clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            0,
                                                                            100
                                                                        ),
                                                                }
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {/* Line */}
                                    {selected.type ===
                                        'LINE' && (
                                        <>
                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Orientation
                                                </span>

                                                <select
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selectedConfig.orientation ||
                                                        'horizontal'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                orientation:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <option value="horizontal">
                                                        Horizontal
                                                    </option>

                                                    <option value="vertical">
                                                        Vertical
                                                    </option>
                                                </select>
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Color
                                                </span>

                                                <input
                                                    type="color"
                                                    value={
                                                        selectedConfig.color ||
                                                        '#D4AF37'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                color:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 h-9 w-full rounded border border-slate-300"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Thickness
                                                </span>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selectedConfig.thickness ??
                                                        3
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                thickness:
                                                                    clamp(
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ),
                                                                        1,
                                                                        20
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>
                                        </>
                                    )}

                                    {/* Background */}
                                    {selected.type ===
                                        'BACKGROUND' && (
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Background
                                                Color
                                            </span>

                                            <input
                                                type="color"
                                                value={
                                                    selectedConfig.color ||
                                                    '#FFFFFF'
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSelectedConfig(
                                                        {
                                                            color: event
                                                                .target
                                                                .value,
                                                        }
                                                    )
                                                }
                                                className="mt-1 h-9 w-full rounded border border-slate-300"
                                            />

                                            <p className="mt-1 text-[11px] text-slate-400">
                                                Background
                                                stays behind
                                                all other
                                                elements.
                                            </p>
                                        </label>
                                    )}

                                    {/* Decoration */}
                                    {selected.type ===
                                        'DECORATION' && (
                                        <>
                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Variant
                                                </span>

                                                <select
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selectedConfig.variant ||
                                                        'corner'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                variant:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <option value="corner">
                                                        Corner
                                                    </option>

                                                    <option value="double_corner">
                                                        Double
                                                        Corner
                                                    </option>

                                                    <option value="seal">
                                                        Seal
                                                    </option>

                                                    <option value="divider">
                                                        Divider
                                                    </option>

                                                    <option value="ornament">
                                                        Ornament
                                                    </option>
                                                </select>
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Primary
                                                    Color
                                                </span>

                                                <input
                                                    type="color"
                                                    value={
                                                        selectedConfig.color ||
                                                        '#D4AF37'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                color:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 h-9 w-full rounded border border-slate-300"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Secondary
                                                    Color
                                                </span>

                                                <input
                                                    type="color"
                                                    value={
                                                        selectedConfig.secondary_color ||
                                                        '#B8860B'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedConfig(
                                                            {
                                                                secondary_color:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 h-9 w-full rounded border border-slate-300"
                                                />
                                            </label>
                                        </>
                                    )}

                                    {/* Common dimensions */}
                                    {selected.type !==
                                        'BACKGROUND' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    X
                                                </span>

                                                <input
                                                    type="number"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selected
                                                            .position
                                                            ?.x ??
                                                        0
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelected(
                                                            {
                                                                position:
                                                                    {
                                                                        ...selected.position,
                                                                        x: clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            0,
                                                                            Math.max(
                                                                                0,
                                                                                template.canvas_width -
                                                                                    (selected.size
                                                                                        ?.width ||
                                                                                        0)
                                                                            )
                                                                        ),
                                                                    },
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Y
                                                </span>

                                                <input
                                                    type="number"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selected
                                                            .position
                                                            ?.y ??
                                                        0
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelected(
                                                            {
                                                                position:
                                                                    {
                                                                        ...selected.position,
                                                                        y: clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            0,
                                                                            Math.max(
                                                                                0,
                                                                                template.canvas_height -
                                                                                    (selected.size
                                                                                        ?.height ||
                                                                                        0)
                                                                            )
                                                                        ),
                                                                    },
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    W
                                                </span>

                                                <input
                                                    type="number"
                                                    min="20"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selected
                                                            .size
                                                            ?.width ??
                                                        20
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelected(
                                                            {
                                                                size:
                                                                    {
                                                                        ...selected.size,
                                                                        width: clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            20,
                                                                            template.canvas_width -
                                                                                (selected.position
                                                                                    ?.x ||
                                                                                    0)
                                                                        ),
                                                                    },
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    H
                                                </span>

                                                <input
                                                    type="number"
                                                    min="20"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selected
                                                            .size
                                                            ?.height ??
                                                        20
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelected(
                                                            {
                                                                size:
                                                                    {
                                                                        ...selected.size,
                                                                        height: clamp(
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                            20,
                                                                            template.canvas_height -
                                                                                (selected.position
                                                                                    ?.y ||
                                                                                    0)
                                                                        ),
                                                                    },
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    )}

                                    {/* Text styling */}
                                    {[
                                        'TEXT',
                                        'DYNAMIC_FIELD',
                                        'CERTIFICATE_NUMBER',
                                        'VERIFICATION_URL',
                                    ].includes(
                                        selected.type
                                    ) && (
                                        <>
                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Font Size
                                                </span>

                                                <input
                                                    type="number"
                                                    min="6"
                                                    max="120"
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selectedStyles.font_size ??
                                                        14
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedStyles(
                                                            {
                                                                font_size:
                                                                    clamp(
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ),
                                                                        6,
                                                                        120
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Color
                                                </span>

                                                <input
                                                    type="color"
                                                    value={
                                                        selectedStyles.color ||
                                                        '#000000'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedStyles(
                                                            {
                                                                color:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="mt-1 h-9 w-full rounded border border-slate-300"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-xs text-slate-500">
                                                    Align
                                                </span>

                                                <select
                                                    className="mt-1 w-full rounded-md border-slate-300 text-sm"
                                                    value={
                                                        selectedStyles.align ||
                                                        'left'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateSelectedStyles(
                                                            {
                                                                align:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <option value="left">
                                                        Left
                                                    </option>

                                                    <option value="center">
                                                        Center
                                                    </option>

                                                    <option value="right">
                                                        Right
                                                    </option>
                                                </select>
                                            </label>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateSelectedStyles(
                                                            {
                                                                bold: !selectedStyles.bold,
                                                            }
                                                        )
                                                    }
                                                    className={`rounded-md border px-3 py-2 text-xs font-medium ${
                                                        selectedStyles.bold
                                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                                            : 'border-slate-300 text-slate-600'
                                                    }`}
                                                >
                                                    Bold
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateSelectedStyles(
                                                            {
                                                                italic: !selectedStyles.italic,
                                                            }
                                                        )
                                                    }
                                                    className={`rounded-md border px-3 py-2 text-xs font-medium ${
                                                        selectedStyles.italic
                                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                                            : 'border-slate-300 text-slate-600'
                                                    }`}
                                                >
                                                    Italic
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Layer controls */}
                                    {[
                                        'RECTANGLE',
                                        'LINE',
                                        'DECORATION',
                                        'TEXT',
                                        'DYNAMIC_FIELD',
                                        'IMAGE',
                                        'CERTIFICATE_NUMBER',
                                        'VERIFICATION_URL',
                                        'QR_CODE',
                                    ].includes(
                                        selected.type
                                    ) && (
                                        <div className="border-t border-slate-100 pt-3">
                                            <span className="text-xs text-slate-500">
                                                Layer
                                            </span>

                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        sendBackward
                                                    }
                                                    className="rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                                >
                                                    Send Back
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        bringForward
                                                    }
                                                    className="rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                                >
                                                    Bring Forward
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Canvas */}
                    <div className="min-w-0 flex-1">
                        <div className="rounded-xl bg-white p-4 shadow">

                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    Click an element to
                                    select. Drag to move.
                                </span>

                                <div className="flex gap-2">
                                    <a
                                        href={route(
                                            'organization.templates.preview',
                                            template.id
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                                    >
                                        Preview
                                    </a>

                                    <button
                                        type="button"
                                        onClick={
                                            saveLayout
                                        }
                                        disabled={saving}
                                        className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {saving
                                            ? 'Saving...'
                                            : 'Save Layout'}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-auto rounded-lg bg-slate-100 p-4">

                                <div
                                    ref={canvasRef}
                                    onMouseMove={
                                        onMove
                                    }
                                    onMouseUp={
                                        endDrag
                                    }
                                    onMouseLeave={
                                        endDrag
                                    }
                                    className="relative overflow-hidden bg-white shadow-lg"
                                    style={{
                                        width: canvasW,
                                        height: canvasH,
                                    }}
                                >

                                    {/* Uploaded template background */}
                                    {template.asset &&
                                        template.asset
                                            .type ===
                                            'image' && (
                                            <img
                                                src={route(
                                                    'organization.templates.asset',
                                                    template.id
                                                )}
                                                alt={
                                                    template
                                                        .asset
                                                        .original_name
                                                }
                                                className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
                                                draggable="false"
                                                style={{
                                                    zIndex: -20,
                                                }}
                                            />
                                        )}

                                    {/* Elements */}
                                    {[...elements]
                                        .sort(
                                            (a, b) =>
                                                (a.sort_order ??
                                                    0) -
                                                (b.sort_order ??
                                                    0)
                                        )
                                        .map(
                                            (
                                                element
                                            ) => {
                                                const isSelected =
                                                    element._id ===
                                                    selectedId;

                                                const style =
                                                    elementStyle(
                                                        element
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            element._id
                                                        }
                                                        onClick={(
                                                            event
                                                        ) => {
                                                            if (
                                                                element.type ===
                                                                'BACKGROUND'
                                                            ) {
                                                                return;
                                                            }

                                                            event.stopPropagation();

                                                            setSelectedId(
                                                                element._id
                                                            );
                                                        }}
                                                        onMouseDown={(
                                                            event
                                                        ) => {
                                                            if (
                                                                element.type ===
                                                                'BACKGROUND'
                                                            ) {
                                                                return;
                                                            }

                                                            event.stopPropagation();

                                                            setSelectedId(
                                                                element._id
                                                            );

                                                            startDrag(
                                                                event,
                                                                element
                                                            );
                                                        }}
                                                        className={
                                                            element.type ===
                                                                'BACKGROUND'
                                                                ? 'absolute'
                                                                : 'absolute cursor-move'
                                                        }
                                                        style={
                                                            {
                                                                ...style,

                                                                outline:
                                                                    isSelected
                                                                        ? '2px dashed #6366F1'
                                                                        : 'none',

                                                                outlineOffset:
                                                                    1,
                                                            }
                                                        }
                                                    >
                                                        {renderCanvasElement(
                                                            element
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}

                                    {/* Render rectangle/line explicitly over contents */}
                                    {[...elements]
                                        .sort(
                                            (a, b) =>
                                                (a.sort_order ??
                                                    0) -
                                                (b.sort_order ??
                                                    0)
                                        )
                                        .map(
                                            (
                                                element
                                            ) => {
                                                if (
                                                    element.type !==
                                                        'RECTANGLE' &&
                                                    element.type !==
                                                        'LINE'
                                                ) {
                                                    return null;
                                                }

                                                const isSelected =
                                                    element._id ===
                                                    selectedId;

                                                return (
                                                    <div
                                                        key={`visual-${element._id}`}
                                                        onClick={(
                                                            event
                                                        ) => {
                                                            event.stopPropagation();

                                                            setSelectedId(
                                                                element._id
                                                            );
                                                        }}
                                                        onMouseDown={(
                                                            event
                                                        ) => {
                                                            event.stopPropagation();

                                                            setSelectedId(
                                                                element._id
                                                            );

                                                            startDrag(
                                                                event,
                                                                element
                                                            );
                                                        }}
                                                        className="absolute cursor-move"
                                                        style={{
                                                            ...elementStyle(
                                                                element
                                                            ),

                                                            outline:
                                                                isSelected
                                                                    ? '2px dashed #6366F1'
                                                                    : 'none',

                                                            outlineOffset:
                                                                1,
                                                        }}
                                                    />
                                                );
                                            }
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}