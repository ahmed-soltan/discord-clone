"use client";

import React, { useEffect, useState } from "react";
import CreateServerModel from "../models/create-server-model";
import InviteServerModel from "../models/invite-server-model";
import EditServerModel from "../models/edit-server-model";
import ManageMembersModel from "../models/manage-members-model";
import CreateChannelModel from "../models/create-channel-model";
import LeaveServerModel from "../models/leave-server-model";
import DeleteServerModel from "../models/delete-server-model";
import DeleteChannelModel from "../models/delete-channel-model";
import EditChannelModel from "../models/edit-channel-model";
import MessageFileModel from "../models/message-file-model";
import DeleteMessageModel from "../models/delete-message-model";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModel />
      <InviteServerModel/>
      <EditServerModel/>
      <ManageMembersModel/>
      <CreateChannelModel/>
      <LeaveServerModel/>
      <DeleteServerModel/>
      <DeleteChannelModel/>
      <EditChannelModel/>
      <MessageFileModel/>
      <DeleteMessageModel/>
    </>
  );
};

export default ModalProvider;
