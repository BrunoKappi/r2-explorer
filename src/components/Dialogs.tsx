/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigationStore } from '../stores/navigationStore';
import { AnimatePresence } from 'motion/react';
import CreateFolderModal from '../features/file-operations/CreateFolderModal';
import RenameModal from '../features/file-operations/RenameModal';
import DeleteModal from '../features/file-operations/DeleteModal';
import DetailsModal from '../features/file-operations/DetailsModal';
import MoveModal from '../features/file-operations/MoveModal';
import UploadModal from '../features/uploads/UploadModal';
import StatsModal from '../features/file-operations/StatsModal';

export default function Dialogs() {
  const { activeDialog } = useNavigationStore();

  return (
    <AnimatePresence>
      {activeDialog === 'create_folder' && <CreateFolderModal />}
      {activeDialog === 'rename' && <RenameModal />}
      {activeDialog === 'delete' && <DeleteModal />}
      {activeDialog === 'details' && <DetailsModal />}
      {activeDialog === 'move' && <MoveModal />}
      {activeDialog === 'upload' && <UploadModal />}
      {activeDialog === 'stats' && <StatsModal />}
    </AnimatePresence>
  );
}
