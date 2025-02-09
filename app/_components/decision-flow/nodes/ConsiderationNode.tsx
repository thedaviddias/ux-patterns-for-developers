'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Handle, Position } from 'reactflow'
import type { NodeData } from '../types'

interface ConsiderationNodeProps {
  data: NodeData
  isConnectable: boolean
}

export function ConsiderationNode({ data, isConnectable }: ConsiderationNodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border border-yellow-200 dark:border-yellow-500/30 bg-yellow-50/80 dark:bg-yellow-900/20 backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-yellow-500"
      />

      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        {data.patternLink ? (
          <Link
            href={data.patternLink}
            className="text-sm font-medium text-yellow-700 hover:text-yellow-800 dark:text-yellow-200 dark:hover:text-yellow-100 transition-colors"
          >
            {data.label}
          </Link>
        ) : (
          <div className="text-sm font-medium text-yellow-700 dark:text-yellow-200">{data.label}</div>
        )}
      </div>

      {data.description && (
        <div className="mt-2 text-xs text-yellow-600/80 dark:text-yellow-200/80">
          {data.description}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-yellow-500"
      />
    </div>
  )
}
