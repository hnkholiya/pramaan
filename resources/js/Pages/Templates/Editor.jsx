import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

let uid = 1;

export default function Editor({ template, element_types, has_been_used }) {
    const [elements, setElements] = useState(
        template.elements.map((element) => ({
            ...element,
            _id: element.id || `e${uid++}`,
        }))
    );

    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);

    const canvasRef = useRef(null);
    const drag = useRef(null);

    const selected = elements.find((element) => element._id === selectedId);

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
                x: Math.round(template.canvas_width / 2 - 150),
                y: Math.round(template.canvas_height / 2 - 20),
            },
            size: {
                width: 300,
                height: 40,
            },
            styles: definition.styles || {},
            sort_order: elements.length,
        };

        setElements((previous) => [...previous, newElement]);
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

    const removeElement = () => {
        setElements((previous) =>
            previous.filter((element) => element._id !== selectedId)
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

        router.post(
            route('organization.templates.save-layout', template.id),
            {
                elements: payload,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    console.log('Pramaan: template layout saved successfully.');
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

    const startDrag = (event) => {
        if (!selected) {
            return;
        }

        drag.current = {
            startX: event.clientX,
            startY: event.clientY,
            origX: selected.position.x,
            origY: selected.position.y,
        };

        event.preventDefault();
    };

    const onMove = (event) => {
        if (!drag.current || !selected) {
            return;
        }

        const dx = (event.clientX - drag.current.startX) / scale;
        const dy = (event.clientY - drag.current.startY) / scale;

        updateSelected({
            position: {
                x: Math.max(
                    0,
                    Math.round(drag.current.origX + dx)
                ),
                y: Math.max(
                    0,
                    Math.round(drag.current.origY + dy)
                ),
            },
        });
    };

    const endDrag = () => {
        drag.current = null;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Template Editor — {template.name}
                </h2>
            }
        >
            <div className="py-6">
                <div className="max-w-[1400px] mx-auto px-4 flex gap-4">
                    {/* Toolbar */}
                    <div className="w-60 bg-white rounded-xl shadow p-4 shrink-0">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">
                            Add Element
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                            {element_types.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        addElement(type.value)
                                    }
                                    className="text-left text-sm border border-slate-200 rounded-lg px-3 py-2 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {has_been_used && (
                            <p className="mt-4 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                                Template already used — saving creates a new
                                version.
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
                                        onClick={removeElement}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="mt-2 space-y-2 text-sm">
                                    <label className="block">
                                        <span className="text-xs text-slate-500">
                                            Name
                                        </span>

                                        <input
                                            className="mt-0.5 w-full rounded-md border-slate-300"
                                            value={selected.name || ''}
                                            onChange={(event) =>
                                                updateSelected({
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                    </label>

                                    {selected.type === 'DYNAMIC_FIELD' && (
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Data Key (CSV field)
                                            </span>

                                            <input
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.data_key || ''
                                                }
                                                onChange={(event) =>
                                                    updateSelected({
                                                        data_key:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                    )}

                                    {selected.type === 'TEXT' && (
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Text
                                            </span>

                                            <textarea
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.config?.text || ''
                                                }
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

                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                X
                                            </span>

                                            <input
                                                type="number"
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.position?.x ?? 0
                                                }
                                                onChange={(event) =>
                                                    updateSelected({
                                                        position: {
                                                            ...selected.position,
                                                            x: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                Y
                                            </span>

                                            <input
                                                type="number"
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.position?.y ?? 0
                                                }
                                                onChange={(event) =>
                                                    updateSelected({
                                                        position: {
                                                            ...selected.position,
                                                            y: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                W
                                            </span>

                                            <input
                                                type="number"
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.size?.width ?? 0
                                                }
                                                onChange={(event) =>
                                                    updateSelected({
                                                        size: {
                                                            ...selected.size,
                                                            width: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-xs text-slate-500">
                                                H
                                            </span>

                                            <input
                                                type="number"
                                                className="mt-0.5 w-full rounded-md border-slate-300"
                                                value={
                                                    selected.size?.height ?? 0
                                                }
                                                onChange={(event) =>
                                                    updateSelected({
                                                        size: {
                                                            ...selected.size,
                                                            height: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="text-xs text-slate-500">
                                            Font Size
                                        </span>

                                        <input
                                            type="number"
                                            className="mt-0.5 w-full rounded-md border-slate-300"
                                            value={
                                                selected.styles?.font_size ??
                                                14
                                            }
                                            onChange={(event) =>
                                                updateSelected({
                                                    styles: {
                                                        ...selected.styles,
                                                        font_size: Number(
                                                            event.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-xs text-slate-500">
                                            Color
                                        </span>

                                        <input
                                            type="color"
                                            className="mt-0.5 h-9 w-full rounded-md border border-slate-300"
                                            value={
                                                selected.styles?.color ||
                                                '#000000'
                                            }
                                            onChange={(event) =>
                                                updateSelected({
                                                    styles: {
                                                        ...selected.styles,
                                                        color: event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-xs text-slate-500">
                                            Align
                                        </span>

                                        <select
                                            className="mt-0.5 w-full rounded-md border-slate-300"
                                            value={
                                                selected.styles?.align ||
                                                'left'
                                            }
                                            onChange={(event) =>
                                                updateSelected({
                                                    styles: {
                                                        ...selected.styles,
                                                        align: event.target.value,
                                                    },
                                                })
                                            }
                                        >
                                            <option value="left">
                                                left
                                            </option>

                                            <option value="center">
                                                center
                                            </option>

                                            <option value="right">
                                                right
                                            </option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-slate-400">
                                    Click an element to select. Drag to move.
                                </span>

                                <div className="flex gap-2">
                                    <a
                                        href={route(
                                            'organization.templates.preview',
                                            template.id
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-50"
                                    >
                                        Preview
                                    </a>

                                    <button
                                        type="button"
                                        onClick={saveLayout}
                                        disabled={saving}
                                        className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {saving
                                            ? 'Saving...'
                                            : 'Save Layout'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-100 rounded-lg p-4 overflow-auto">
                                <div
                                    ref={canvasRef}
                                    onMouseDown={startDrag}
                                    onMouseMove={onMove}
                                    onMouseUp={endDrag}
                                    onMouseLeave={endDrag}
                                    className="relative bg-white shadow-lg"
                                    style={{
                                        width: canvasW,
                                        height: canvasH,
                                    }}
                                >
                                    {elements.map((element) => {
                                        const isSelected =
                                            element._id === selectedId;

                                        return (
                                            <div
                                                key={element._id}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedId(
                                                        element._id
                                                    );
                                                }}
                                                onMouseDown={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedId(
                                                        element._id
                                                    );
                                                    startDrag(event);
                                                }}
                                                className="absolute cursor-move flex items-center justify-center"
                                                style={{
                                                    left:
                                                        element.position.x *
                                                        scale,

                                                    top:
                                                        element.position.y *
                                                        scale,

                                                    width:
                                                        element.size.width *
                                                        scale,

                                                    height:
                                                        element.size.height *
                                                        scale,

                                                    fontSize:
                                                        (element.styles
                                                            ?.font_size ||
                                                            14) * scale,

                                                    color:
                                                        element.styles?.color ||
                                                        '#000',

                                                    textAlign:
                                                        element.styles?.align ||
                                                        'left',

                                                    border: isSelected
                                                        ? '2px dashed #6366f1'
                                                        : '1px solid transparent',

                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {element.type === 'QR_CODE'
                                                    ? '◈ QR'
                                                    : element.type === 'IMAGE'
                                                      ? '🖼'
                                                      : label(element)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
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