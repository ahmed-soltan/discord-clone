"use client";

import React, { useEffect, useState } from "react";
import CreateServerModel from "../models/create-server-model";
import InviteServerModel from "../models/invite-server-model";
import EditServerModel from "../models/edit-server-model";
import ManageMembersModel from "../models/manage-members-model";
import CreateChannelModel from "../models/create-channel-model";
import LeaverServerModel from "../models/leave-server-model";

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
      <CreateServerModel />;
      <InviteServerModel/>
      <EditServerModel/>
      <ManageMembersModel/>
      <CreateChannelModel/>
      <LeaverServerModel/>
    </>
  );
};

export default ModalProvider;
